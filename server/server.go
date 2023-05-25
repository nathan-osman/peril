package server

import (
	"context"
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/nathan-osman/go-state"
	"github.com/nathan-osman/peril/ui"
	"github.com/rs/zerolog/log"
)

const (
	roleAdmin       = "admin"
	roleHost        = "host"
	roleBoard       = "board"
	roleContestants = "contestants"
)

var allRoles = []string{
	roleAdmin,
	roleHost,
	roleBoard,
	roleContestants,
}

// Server manages the game state and ensures connected clients stay
// synchronized by using server-sent events.
type Server struct {
	server http.Server
	state  *state.State
	tokens map[string]string
}

// New creates a new Server instance.
func New(cfg *Config) *Server {

	// Switch to release mode
	gin.SetMode(gin.ReleaseMode)

	// Create and initialize the server
	var (
		r = gin.New()
		s = &Server{
			server: http.Server{
				Addr:    cfg.Addr,
				Handler: r,
			},
			tokens: make(map[string]string),
		}
	)
	s.state = state.New(&state.Config{
		RoleFn: s.roleForClient,
	})
	for _, r := range []string{roleAdmin, roleHost, roleBoard, roleContestants} {
		s.tokens[generateRandomString()] = r
	}

	// Initialize game state
	s.initState()

	// TODO: don't use the console for this

	// Print the tokens that were generated
	fmt.Println("Tokens for connected clients:")
	fmt.Println()
	for t, r := range s.tokens {
		fmt.Printf("%12s %s\n", r, t)
	}
	fmt.Println()

	// Serve the static files
	r.Use(static.Serve("/", ui.EmbedFileSystem{FileSystem: http.FS(ui.Content)}))

	// SSE method
	r.GET("/sse/:token", s.sse)

	// API methods
	api := r.Group("/api")
	api.Use(gin.CustomRecoveryWithWriter(nil, panicToJSONError))
	{
		// Methods restricted to admins
		apiAdmin := api.Group("")
		apiAdmin.Use(s.restrictTo([]string{roleAdmin}))
		{
			apiAdmin.POST("/load", s.apiLoad)
			apiAdmin.POST("/addPlayer", s.apiAddPlayer)
			apiAdmin.POST("/adjustScore", s.apiAdjustScore)
		}

		// Methods restricted to admins and host
		apiAdminHost := api.Group("")
		apiAdminHost.Use(s.restrictTo([]string{roleAdmin, roleHost}))
		{
			apiAdminHost.POST("/advanceRound", s.apiAdvanceRound)
			apiAdminHost.POST("/startRound", s.apiStartRound)
			apiAdminHost.POST("/advanceCategory", s.apiAdvanceCategory)
			apiAdminHost.POST("/showBoard", s.apiShowBoard)
			apiAdminHost.POST("/selectClue", s.apiSelectClue)
			apiAdminHost.POST("/setWager", s.apiSetWager)
			apiAdminHost.POST("/discardClue", s.apiDiscardClue)
			apiAdminHost.POST("/judgeAnswer", s.apiJudgeAnswer)
		}

		// Methods restricted to admins and contestants
		apiAdminContestants := api.Group("")
		apiAdminContestants.Use(s.restrictTo([]string{roleAdmin, roleContestants}))
		{
			apiAdminContestants.POST("/setGuessingPlayer", s.apiSetGuessingPlayer)
		}

		// Methods not restricted to any roles
		apiAny := api.Group("")
		apiAny.Use(s.restrictTo(allRoles))
		{
			apiAny.GET("/verify", s.apiVerify)
		}
	}

	// Start the server
	go func() {
		defer log.Info().Msg("server stopped")
		log.Info().Msg("server started")
		if err := s.server.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
			log.Error().Msg(err.Error())
		}
	}()

	return s
}

// Close shuts down the server.
func (s *Server) Close() {
	s.state.Close()
	s.server.Shutdown(context.Background())
}

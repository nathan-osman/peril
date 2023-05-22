package server

import (
	"context"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nathan-osman/go-state"
	"github.com/rs/zerolog/log"
)

const (
	roleAdmin       = "admin"
	roleHost        = "host"
	roleBoard       = "board"
	roleContestants = "contestants"
)

// Server manages the game state and ensures connected clients stay
// synchronized by using server-sent events.
type Server struct {
	server http.Server
	state  *state.State
	tokens map[string]string
}

// New creates a new Server instance.
func New(cfg *Config) (*Server, error) {

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

	// SSE method
	r.GET("/sse/:token", s.sse)

	// API methods
	api := r.Group("/api")
	{
		// Turn panics into JSON errors
		api.Use(gin.CustomRecovery(func(c *gin.Context, i interface{}) {
			var message string
			switch v := i.(type) {
			case error:
				message = v.Error()
			case string:
				message = v
			default:
				message = "an unknown error has occurred"
			}
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": message,
			})
		}))

		// Methods
		// TODO
	}

	// Start the server
	go func() {
		defer log.Info().Msg("server stopped")
		log.Info().Msg("server started")
		if err := s.server.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
			log.Error().Msg(err.Error())
		}
	}()

	return s, nil
}

// Close shuts down the server.
func (s *Server) Close() {
	s.state.Close()
	s.server.Shutdown(context.Background())
}

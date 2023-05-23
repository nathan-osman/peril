package server

import (
	"context"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
)

type sseContextType string

const sseContextRole sseContextType = "role"

func (s *Server) roleForClient(r *http.Request) string {
	return r.Context().Value(sseContextRole).(string)
}

func (s *Server) sse(c *gin.Context) {

	// Determine if the token represents a valid role
	t := c.Param("token")
	r, ok := s.tokens[t]
	if !ok {
		c.Error(errors.New("invalid token"))
		return
	}

	// Store the role in the request context and continue processing the socket
	ctx := context.WithValue(c.Request.Context(), sseContextRole, r)
	s.state.ServeHTTP(c.Writer, c.Request.WithContext(ctx))
}

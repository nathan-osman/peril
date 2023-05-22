package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nathan-osman/go-state"
)

func (s *Server) restrictTo(roles []string) gin.HandlerFunc {
	return func(c *gin.Context) {
		t := c.Request.Header.Get("Token")
		role, ok := s.tokens[t]
		if !ok {
			panic("the provided token is invalid")
		}
		for _, r := range roles {
			if r == role {
				c.Next()
				return
			}
		}
		panic("you are not authorized to call this method")
	}
}

func (s *Server) apiStart(c *gin.Context) {
	s.state.Update(state.Object{stateStarted: true}, nil)
	c.JSON(http.StatusOK, gin.H{})
}

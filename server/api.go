package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nathan-osman/go-state"
)

const contextRole = "role"

func (s *Server) restrictTo(roles []string) gin.HandlerFunc {
	return func(c *gin.Context) {
		t := c.Request.Header.Get("Token")
		role, ok := s.tokens[t]
		if !ok {
			panic("the provided token is invalid")
		}
		for _, r := range roles {
			if r == role {
				c.Set(contextRole, role)
				c.Next()
				return
			}
		}
		panic("you are not authorized to call this method")
	}
}

type apiLoadGame struct {
	Rounds [][]struct {
		Name  string `json:"name"`
		Desc  string `json:"desc"`
		Clues []struct {
			Question string `json:"question"`
			Answer   string `json:"answer"`
			Used     bool   `json:"-"`
		} `json:"clues"`
	} `json:"rounds"`
}

func (s *Server) apiLoad(c *gin.Context) {
	v := &apiLoadGame{}
	if err := c.ShouldBindJSON(v); err != nil {
		panic(err)
	}
	var (
		roundsPrivate [][]state.Object
		roundsPublic  [][]state.Object
	)
	for _, r := range v.Rounds {
		var (
			categoriesPrivate []state.Object
			categoriesPublic  []state.Object
		)
		for _, c := range r {
			var (
				cluesPrivate []state.Object
				cluesPublic  []state.Object
			)
			for _, clue := range c.Clues {
				cluesPrivate = append(cluesPrivate, state.Object{
					"question": clue.Question,
					"answer":   clue.Answer,
					"used":     clue.Used,
				})
				cluesPublic = append(cluesPublic, state.Object{
					"used": clue.Used,
				})
			}
			categoriesPrivate = append(categoriesPrivate, state.Object{
				"name":  c.Name,
				"desc":  c.Desc,
				"clues": cluesPrivate,
			})
			categoriesPublic = append(categoriesPublic, state.Object{
				"name":  c.Name,
				"clues": cluesPublic,
			})
		}
		roundsPrivate = append(roundsPrivate, categoriesPrivate)
		roundsPublic = append(roundsPublic, categoriesPublic)
	}
	s.state.Update(state.Object{
		"clues": roundsPrivate,
	}, []string{roleAdmin, roleHost})
	s.state.Update(state.Object{
		"clues": roundsPublic,
	}, []string{roleBoard})
	c.JSON(http.StatusOK, gin.H{})
}

func (s *Server) apiStart(c *gin.Context) {
	s.state.Update(state.Object{stateStarted: true}, nil)
	c.JSON(http.StatusOK, gin.H{})
}

func (s *Server) apiVerify(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"role": c.GetString(contextRole),
	})
}

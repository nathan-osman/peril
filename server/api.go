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

func (s *Server) getClue(o state.Object) (state.Object, bool) {
	var (
		round         = o[stateRound].(int)
		clues         = o[stateClues].([][]state.Object)
		categoryIndex = o[stateCategoryIndex].(int)
		clueIndex     = o[stateClueIndex].(int)
	)
	if round > len(clues) {
		return nil, false
	}
	categories := clues[round-1]
	if categoryIndex >= len(categories) {
		return nil, false
	}
	var (
		category      = categories[categoryIndex]
		categoryClues = category["clues"].([]state.Object)
	)
	if clueIndex >= len(categoryClues) {
		return nil, false
	}
	return categoryClues[clueIndex], true
}

type apiLoadParams struct {
	GameName    string `json:"game_name"`
	SpecialName string `json:"special_name"`
	Rounds      [][]struct {
		Name  string `json:"name"`
		Desc  string `json:"desc"`
		Clues []struct {
			Question string `json:"question"`
			Answer   string `json:"answer"`
			Special  bool   `json:"special"`
			Used     bool   `json:"-"`
		} `json:"clues"`
	} `json:"rounds"`
}

func (s *Server) apiLoad(c *gin.Context) {
	v := &apiLoadParams{}
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
					"special":  clue.Special,
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
	var (
		objPrivate = state.Object{
			stateClues: roundsPrivate,
		}
		objPublic = state.Object{
			stateClues: roundsPublic,
		}
	)
	if v.GameName != "" {
		objPrivate[stateGameName] = v.GameName
		objPublic[stateGameName] = v.GameName
	}
	if v.SpecialName != "" {
		objPrivate[stateSpecialName] = v.SpecialName
		objPublic[stateSpecialName] = v.SpecialName
	}
	s.state.Update(objPrivate, []string{roleAdmin, roleHost})
	s.state.Update(objPublic, []string{roleBoard})
	c.JSON(http.StatusOK, gin.H{})
}

type apiAddPlayerParams struct {
	Name string `json:"name"`
}

func (s *Server) apiAddPlayer(c *gin.Context) {
	v := &apiAddPlayerParams{}
	if err := c.ShouldBindJSON(v); err != nil {
		panic(err)
	}
	s.state.UpdateFunc(func(o state.Object, r string) state.Object {
		players := o[statePlayers].([]state.Object)
		players = append(players, state.Object{
			"name":  v.Name,
			"score": 0,
		})
		return state.Object{
			statePlayers: players,
		}
	}, nil)
	c.JSON(http.StatusOK, gin.H{})
}

func (s *Server) apiAdvanceRound(c *gin.Context) {
	s.state.UpdateFunc(func(o state.Object, r string) state.Object {
		return state.Object{
			stateRound:           o[stateRound].(int) + 1,
			stateRoundStarted:    false,
			stateCategoriesShown: false,
		}
	}, nil)
	c.JSON(http.StatusOK, gin.H{})
}

func (s *Server) apiStartRound(c *gin.Context) {
	s.state.Update(state.Object{
		stateRoundStarted:  true,
		stateCategoryIndex: 0,
	}, nil)
	c.JSON(http.StatusOK, gin.H{})
}

func (s *Server) apiAdvanceCategory(c *gin.Context) {
	s.state.UpdateFunc(func(o state.Object, r string) state.Object {
		return state.Object{
			stateCategoryIndex: o[stateCategoryIndex].(int) + 1,
		}
	}, nil)
	c.JSON(http.StatusOK, gin.H{})
}

func (s *Server) apiShowBoard(c *gin.Context) {
	s.state.Update(state.Object{
		stateCategoriesShown: true,
		stateCategoryIndex:   -1,
		stateClueIndex:       -1,
	}, nil)
	c.JSON(http.StatusOK, gin.H{})
}

type apiSelectClueParams struct {
	CategoryIndex int `json:"category_index"`
	ClueIndex     int `json:"clue_index"`
	ClueValue     int `json:"clue_value"`
}

func (s *Server) apiSelectClue(c *gin.Context) {
	v := &apiSelectClueParams{}
	if err := c.ShouldBindJSON(v); err != nil {
		panic(err)
	}
	s.state.Update(state.Object{
		stateCategoryIndex:       v.CategoryIndex,
		stateClueIndex:           v.ClueIndex,
		stateClueValue:           v.ClueValue,
		stateSpecialShown:        false,
		stateGuessingPlayerIndex: -1,
	}, nil)
	c.JSON(http.StatusOK, gin.H{})
}

type apiSetWagerParams struct {
	Value int `json:"value"`
}

func (s *Server) apiSetWager(c *gin.Context) {
	v := &apiSetWagerParams{}
	if err := c.ShouldBindJSON(v); err != nil {
		panic(err)
	}
	s.state.Update(state.Object{
		stateClueValue: v.Value,
	}, nil)
	c.JSON(http.StatusOK, gin.H{})
}

func (s *Server) apiDiscardClue(c *gin.Context) {
	s.state.UpdateFunc(func(o state.Object, r string) state.Object {
		c, ok := s.getClue(o)
		if !ok {
			return state.Object{}
		}
		c["used"] = true
		return state.Object{
			stateClues:         o[stateClues],
			stateCategoryIndex: -1,
			stateClueIndex:     -1,
		}
	}, nil)
	c.JSON(http.StatusOK, gin.H{})
}

type apiSetGuessingPlayerParams struct {
	Index int `json:"index"`
}

func (s *Server) apiSetGuessingPlayer(c *gin.Context) {
	v := &apiSetGuessingPlayerParams{}
	if err := c.ShouldBindJSON(v); err != nil {
		panic(err)
	}
	s.state.Update(state.Object{
		stateGuessingPlayerIndex: v.Index,
	}, nil)
	c.JSON(http.StatusOK, gin.H{})
}

type apiJudgeAnswerParams struct {
	Correct bool `json:"correct"`
}

func (s *Server) apiJudgeAnswer(c *gin.Context) {
	v := &apiJudgeAnswerParams{}
	if err := c.ShouldBindJSON(v); err != nil {
		panic(err)
	}
	s.state.UpdateFunc(func(o state.Object, r string) state.Object {
		c, ok := s.getClue(o)
		if !ok {
			return state.Object{}
		}
		var (
			guessingPlayerIndex = o[stateGuessingPlayerIndex].(int)
			players             = o[statePlayers].([]state.Object)
		)
		if guessingPlayerIndex >= len(players) {
			return state.Object{}
		}
		var (
			p        = players[guessingPlayerIndex]
			scoreAdj = o[stateClueValue].(int)
			special  = c["special"].(bool)
			newObj   = state.Object{}
		)
		if v.Correct {
			p["score"] = p["score"].(int) + scoreAdj
		} else {
			p["score"] = p["score"].(int) - scoreAdj
		}
		if v.Correct || special {
			c["used"] = true
			newObj = state.Object{
				stateClues:         o[stateClues],
				stateCategoryIndex: -1,
				stateClueIndex:     -1,
			}
		}
		return newObj
	}, nil)
	c.JSON(http.StatusOK, gin.H{})
}

func (s *Server) apiVerify(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"role": c.GetString(contextRole),
	})
}

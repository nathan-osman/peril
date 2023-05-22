package server

import "github.com/nathan-osman/go-state"

const (
	stateStarted           = "started"
	stateRound             = "round"
	stateBoardState        = "board_state"
	stateCategories        = "categories"
	stateCategoryIndex     = "category_index"
	stateCurrentClue       = "current_clue"
	stateActivePlayerIndex = "active_player_index"
	statePlayers           = "players"

	bsSplash = "splash"
)

func (s *Server) initState() {

	// State shared between all roles
	s.state.Update(state.Object{

		// Global game state
		stateStarted: false,
		stateRound:   0,

		// Data for the board
		stateBoardState:    bsSplash,
		stateCategories:    []string{},
		stateCategoryIndex: 0,

		// Data for clues
		stateCurrentClue:       state.Object{},
		stateActivePlayerIndex: 0,

		// Data for players
		statePlayers: []state.Object{},
	}, []string{roleAdmin, roleHost, roleBoard, roleContestants})
}

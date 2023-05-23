package server

import "github.com/nathan-osman/go-state"

const (
	stateRound             = "round"
	stateCategories        = "categories"
	stateCategoryIndex     = "category_index"
	stateClues             = "clues"
	stateClueIndex         = "clue_index"
	stateActivePlayerIndex = "active_player_index"
	statePlayers           = "players"
)

func (s *Server) initState() {

	// State shared between all roles
	s.state.Update(state.Object{

		// Global game state
		stateRound: 0,

		// Data for the board
		stateCategories:    []string{},
		stateCategoryIndex: -1,

		// Data for clues
		stateClues:     [][]state.Object{},
		stateClueIndex: -1,

		stateActivePlayerIndex: 0,

		// Data for players
		statePlayers: []state.Object{},
	}, allRoles)
}

package server

import "github.com/nathan-osman/go-state"

const (
	stateRound             = "round"
	stateClues             = "clues"
	stateClue              = "clue"
	stateActivePlayerIndex = "active_player_index"
	statePlayers           = "players"
)

func (s *Server) initState() {

	// State shared between all roles
	s.state.Update(state.Object{

		// Global game state
		stateRound: 0,

		// Data for clues
		stateClues: [][]state.Object{},
		stateClue:  nil,

		stateActivePlayerIndex: 0,

		// Data for players
		statePlayers: []state.Object{},
	}, allRoles)
}

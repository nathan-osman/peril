package server

import "github.com/nathan-osman/go-state"

const (
	stateRound             = "round"
	stateClues             = "clues"
	stateClue              = "clue"
	statePlayers           = "players"
	stateActivePlayerIndex = "active_player_index"
)

func (s *Server) initState() {

	// State shared between all roles
	s.state.Update(state.Object{

		// Global game state
		stateRound: 0,

		// Data for clues
		stateClues: [][]state.Object{},
		stateClue:  nil,

		// Data for players
		statePlayers:           []state.Object{},
		stateActivePlayerIndex: -1,
	}, allRoles)
}

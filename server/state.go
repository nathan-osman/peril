package server

import "github.com/nathan-osman/go-state"

const (
	stateGameName            = "game_name"
	stateSpecialName         = "special_name"
	stateRound               = "round"
	stateRoundStarted        = "round_started"
	stateCategoriesShown     = "categories_shown"
	stateClues               = "clues"
	stateCategoryIndex       = "category_index"
	stateClueIndex           = "clue_index"
	stateClueValue           = "clue_value"
	stateSpecialShown        = "special_shown"
	stateGuessingPlayerIndex = "guessing_player_index"
	statePlayers             = "players"
	stateActivePlayerIndex   = "active_player_index"
)

/*

Game flow is roughly as follows:

- the admin needs to load the data into clues (load)
- the admin also adds players to the game (addPlayer)
- round is 0, indicating the game has not yet begun; game splash is shown
- round is advanced (advanceRound) but round_started is still false, round
  splash is shown
- round_started is set to true (startRound) but categories_shown is false, the
  categories are shown in order based on category_index (advanceCategory); once
  the final category is shown, categories_shown is set to true (showBoard)
- the active_player_index tracks who has focus and is used to determine who may
  select a clue, whom to apply score changes to, etc.
- a clue is selected (selectClue) and if this is a special clue, the special
  splash is shown and the wager is set (setWager), at which point specialShown
  is set to true and the clue is displayed;
- either nobody answers (discardClue) or a player buzzes in (setGuessingPlayer)
  the player gives their answer, and it is judged (judgeAnswer)
- if the answer was correct, the guessing player is awarded the points and the,
  clue is removed, otherwise they are simply deducted

*/

func (s *Server) initState() {

	// State shared between all roles
	s.state.Update(state.Object{

		// Global game properties
		stateGameName:    "Peril",
		stateSpecialName: "Special",

		// Global game state
		stateRound:           0,
		stateRoundStarted:    false,
		stateCategoriesShown: false,

		// Data for clues
		stateClues:               [][]state.Object{},
		stateCategoryIndex:       -1,
		stateClueIndex:           -1,
		stateClueValue:           0,
		stateSpecialShown:        false,
		stateGuessingPlayerIndex: -1,

		// Data for players
		statePlayers:           []state.Object{},
		stateActivePlayerIndex: 0,
	}, allRoles)
}

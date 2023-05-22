package server

import (
	"encoding/hex"
	"math/rand"
	"time"
)

// Function based on https://stackoverflow.com/a/46909816/193619

var randSrc = rand.New(rand.NewSource(time.Now().UnixNano()))

func generateRandomString() string {
	b := make([]byte, 16)
	if _, err := randSrc.Read(b); err != nil {
		panic(err)
	}
	return hex.EncodeToString(b)
}

package server

import (
	"encoding/hex"
	"math/rand"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
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

func panicToJSONError(c *gin.Context, i interface{}) {
	var message string
	switch v := i.(type) {
	case error:
		message = v.Error()
	case string:
		message = v
	default:
		message = "an unknown error has occurred"
	}
	c.JSON(http.StatusInternalServerError, gin.H{
		"error": message,
	})
}

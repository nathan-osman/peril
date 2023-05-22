package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"github.com/nathan-osman/peril/server"
	"github.com/urfave/cli/v2"
)

func main() {
	app := &cli.App{
		Name:  "peril",
		Usage: "game server for Peril",
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:    "server-addr",
				Value:   ":http",
				EnvVars: []string{"SERVER_ADDR"},
				Usage:   "HTTP address to listen on",
			},
		},
		Action: func(c *cli.Context) error {

			// Create and start the server
			s := server.New(&server.Config{
				Addr: c.String("server-addr"),
			})
			defer s.Close()

			// Wait for SIGINT or SIGTERM
			sigChan := make(chan os.Signal, 1)
			signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
			<-sigChan

			return nil
		},
	}
	if err := app.Run(os.Args); err != nil {
		fmt.Fprintf(os.Stderr, "fatal: %s\n", err.Error())
	}
}

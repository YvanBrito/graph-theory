package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Node struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type Link struct {
	Source int `json:"source"`
	Target int `json:"target"`
}

type Graph struct {
	Nodes []Node `json:"nodes"`
	Links []Link `json:"links"`
}

func main() {
	fs := http.FileServer(http.Dir("./static"))

	mux := http.NewServeMux()
	mux.Handle("/", fs)

	mux.HandleFunc("/build-graph", func(w http.ResponseWriter, r *http.Request) {
		matrix := buildGraph()
		graph := convertMatrixToStruct(matrix)

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(graph)
	})

	fmt.Println("Servidor rodando em http://localhost:8080")
	http.ListenAndServe(":8080", mux)
}

func buildGraph() [][]int {
	size := 10
	main_graph := initGraph(size)
	// Nó 0
	main_graph[0][1] = 1
	main_graph[0][2] = 1
	main_graph[0][3] = 1

	// Nó 1
	main_graph[1][0] = 1
	main_graph[1][2] = 1
	main_graph[1][4] = 1

	// Nó 2
	main_graph[2][0] = 1
	main_graph[2][1] = 1
	main_graph[2][5] = 1

	// Nó 3
	main_graph[3][0] = 1
	main_graph[3][6] = 1

	// Nó 4
	main_graph[4][1] = 1
	main_graph[4][5] = 1
	main_graph[4][7] = 1

	// Nó 5
	main_graph[5][2] = 1
	main_graph[5][4] = 1
	main_graph[5][8] = 1

	// Nó 6
	main_graph[6][3] = 1
	main_graph[6][7] = 1
	main_graph[6][9] = 1

	// Nó 7
	main_graph[7][4] = 1
	main_graph[7][6] = 1
	main_graph[7][8] = 1

	// Nó 8
	main_graph[8][5] = 1
	main_graph[8][7] = 1
	main_graph[8][9] = 1

	// Nó 9
	main_graph[9][6] = 1
	main_graph[9][8] = 1
	return main_graph
}

func initGraph(size int) [][]int {
	flat := make([]int, size*size)
	graph := make([][]int, size)
	for i := range graph {
		graph[i] = flat[i*size : (i+1)*size]
	}

	return graph
}

func printGraph(graph [][]int) {
	for _, v := range graph {
		for _, b := range v {
			fmt.Printf("%d ", b)
		}
		fmt.Printf("\n")
	}
}

func convertMatrixToStruct(matrix [][]int) Graph {
	size := len(matrix)
	nodes := make([]Node, size)
	links := []Link{}

	for i := 0; i < size; i++ {
		nodes[i] = Node{Id: i, Name: string(rune('A' + i))}
		for j := i; j < size; j++ {
			if matrix[i][j] == 1 {
				links = append(links, Link{Source: i, Target: j})
			}
		}
	}

	return Graph{Nodes: nodes, Links: links}
}

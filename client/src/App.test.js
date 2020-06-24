import React from "react"
import ReactDOM from "react-dom"
import App from "./App"

it("renders without crashing", () => {
  const div = document.createElement("div")
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})

it("should load the correct book based on the book ID in the URL", () => {

})

it("should show the tags field in the Book component", () => {

})

it("should hide the list of tags initially when loaded", () => {

})

it("should show ellipses indicating a click action to see the tags list", () => {

})

it("should toggle showing the list of tags after clicking on the Tags element", () => {

})

it("should toggle showing the list of tags after clicking on the ellipses element", () => {

})

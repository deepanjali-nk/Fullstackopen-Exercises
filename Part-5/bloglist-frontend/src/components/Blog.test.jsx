import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

test("renders blog title and blog author but not likes and url", async () => {
    const blog = {
      title: "Test",
      author: "Demo",
      url: "https://localhost:3000/",
      likes: 2,
    };
    const { container } = render(<Blog blog={blog} />);
    const div = container.querySelector(".blog");
    expect(div).toHaveTextContent("Test");
    expect(div).toHaveTextContent("Demo");

    expect(div).not.toHaveTextContent("https://localhost:3000/");
    expect(div).not.toHaveTextContent(2);
});


test("Likes and Url will be shown when toggled", async () => {
  const blog = {
    title: "A test-case",
    author: "Jest Library",
    url: "https://localhost:3000/",
    likes: 99,
  };
  const container = render(<Blog blog={blog} />).container;

  const user = userEvent.setup();
  const button = screen.getByText("View");
  await user.click(button);

  const div = container.querySelector(".blog");
  expect(div).toHaveTextContent("https://localhost:3000/");
  expect(div).toHaveTextContent("99");
  expect(screen.queryByText("Likes")).toBeDefined();
  expect(screen.queryByText("url")).toBeDefined();
});

test("like button is clicked twice, event handler is called twice", async () => {
  const blog = {
    title: "A test-case",
    author: "Jest Library",
    url: "https://localhost:3000/",
    likes: 99,
  };
  const mockHandler = vi.fn();
  render(<Blog blog={blog} updateLikes={mockHandler} />);
  const user = userEvent.setup();
  const button = screen.getByText("View");
  await user.click(button);
  expect(screen.queryByText("Like")).toBeDefined();
  const like_button = screen.getByText("Like");
  await user.click(like_button);
  await user.click(like_button);
  expect(mockHandler.mock.calls).toHaveLength(2);


});

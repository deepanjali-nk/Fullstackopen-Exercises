import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

test('calls createBlog with correct details when a new blog is created', async () => {
  const createBlog = vi.fn();

  render(<BlogForm createBlog={createBlog} />);

  await userEvent.type(screen.getByPlaceholderText('Enter title'), 'New Blog Title');
  await userEvent.type(screen.getByPlaceholderText('Enter author'), 'John Doe');
  await userEvent.type(screen.getByPlaceholderText('Enter blog URL'), 'https://example.com');

  await userEvent.click(screen.getByText('Create'));

  expect(createBlog).toHaveBeenCalledWith({
    title: 'New Blog Title',
    author: 'John Doe',
    url: 'https://example.com',
  });
});

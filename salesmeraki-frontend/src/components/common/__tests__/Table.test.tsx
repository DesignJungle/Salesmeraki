import { render, screen } from '@testing-library/react';
import { Table } from '../Table';

describe('Table', () => {
  it('renders the table with all subcomponents', () => {
    render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>John Doe</Table.Cell>
            <Table.Cell>john@example.com</Table.Cell>
            <Table.Cell>Admin</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Jane Smith</Table.Cell>
            <Table.Cell>jane@example.com</Table.Cell>
            <Table.Cell>User</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
    
    // Check if the table headers are rendered
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    
    // Check if the table cells are rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('applies custom className to Table component', () => {
    render(
      <Table className="custom-table">
        <Table.Body>
          <Table.Row>
            <Table.Cell>Test</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
    
    // Find the table element and check if it has the custom class
    const table = screen.getByRole('table');
    expect(table).toHaveClass('custom-table');
  });

  it('applies custom className to Table.Header component', () => {
    render(
      <Table>
        <Table.Header className="custom-header">
          <Table.Row>
            <Table.HeaderCell>Test</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Test</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
    
    // Find the thead element and check if it has the custom class
    const thead = document.querySelector('thead');
    expect(thead).toHaveClass('custom-header');
  });

  it('applies custom className to Table.Body component', () => {
    render(
      <Table>
        <Table.Body className="custom-body">
          <Table.Row>
            <Table.Cell>Test</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
    
    // Find the tbody element and check if it has the custom class
    const tbody = document.querySelector('tbody');
    expect(tbody).toHaveClass('custom-body');
  });

  it('applies custom className to Table.Row component', () => {
    render(
      <Table>
        <Table.Body>
          <Table.Row className="custom-row">
            <Table.Cell>Test</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
    
    // Find the tr element and check if it has the custom class
    const tr = document.querySelector('tr');
    expect(tr).toHaveClass('custom-row');
  });

  it('applies custom className to Table.HeaderCell component', () => {
    render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="custom-header-cell">Test</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Test</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
    
    // Find the th element and check if it has the custom class
    const th = document.querySelector('th');
    expect(th).toHaveClass('custom-header-cell');
  });

  it('applies custom className to Table.Cell component', () => {
    render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell className="custom-cell">Test</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
    
    // Find the td element and check if it has the custom class
    const td = document.querySelector('td');
    expect(td).toHaveClass('custom-cell');
  });
});

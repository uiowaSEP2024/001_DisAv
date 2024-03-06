import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Shop, { items } from '../Shop'; // Ensure the path is correct


describe('Shop Component', () => {
    // Test to ensure the Shop component renders without crashing
    it('renders without crashing', () => {
        render(<Shop />);
        expect(screen.getAllByText('Purchase')).toHaveLength(items.length);
    });

    // Test to check if the correct number of shop items are rendered
    it('renders the correct number of shop items', () => {
        render(<Shop />);
        const shopItems = screen.getAllByRole('button', { name: 'Purchase' });
        expect(shopItems).toHaveLength(4); // Update this number based on the number of items you expect
    });

    // Test to check if the shop items display the correct content
    it('displays the correct content for shop items', () => {
        render(<Shop />);
        // Check for specific content in your shop items
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('1000 points')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
        expect(screen.getByText('500 points')).toBeInTheDocument();
        // ... and so on for other items
    });

    // Additional test to check if the purchase button is present for each item
    it('includes a purchase button for each item', () => {
        render(<Shop />);
        items.forEach(item => {
            expect(screen.getByText(`${item.name}`)).toBeInTheDocument();
            expect(screen.getByText(`${item.cost} points`)).toBeInTheDocument();
            expect(screen.getAllByRole('button', { name: 'Purchase' })).toHaveLength(items.length);
        });
    });
});

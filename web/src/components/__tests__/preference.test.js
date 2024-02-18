import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Preference from '../Preference';
import { AuthProvider } from '../AuthContext';

test('allows the user to toggle preferences', () => {
    render(
        <AuthProvider>
            <Preference />
        </AuthProvider>
    );

    const workCheckbox = screen.getByLabelText(/work/i);
    fireEvent.click(workCheckbox);
    expect(workCheckbox).toBeChecked();

    const readingCheckbox = screen.getByLabelText(/reading/i);
    fireEvent.click(readingCheckbox);
    expect(readingCheckbox).toBeChecked();


});

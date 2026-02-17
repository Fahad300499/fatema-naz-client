import React from 'react';
import { Outlet } from 'react-router';

const MainLayouts = () => {
    return (
        <div>
            <Outlet></Outlet>
        </div>
    );
};

export default MainLayouts;
"use client";

import React from "react";
import dynamic from "next/dynamic";
import Widget from "./Widget";

const GridLayout = dynamic(() => import("react-grid-layout"), { ssr: false });

export default function DashboardGrid({ layout, widgets, onLayoutChange, editMode }: any) {
    return (
        <div className="flex-1 p-4">
            <GridLayout
                className="layout"
                layout={layout}
                cols={12}
                rowHeight={80}
                width={1200}
                onLayoutChange={onLayoutChange}
                isDraggable={editMode} // 🔥 hanya bisa drag saat edit mode
                isResizable={editMode} // 🔥 resize juga
            >
                {widgets.map((widget) => (
                    <div key={widget.id} data-grid={widget.layout}>
                        <Widget widget={widget} />
                    </div>
                ))}
            </GridLayout>
        </div>
    );
}

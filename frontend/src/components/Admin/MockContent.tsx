import React from "react";

const MockContent: React.FC = () => {
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Mock Content</h1>
			<p className="text-gray-600 dark:text-gray-400">
				This is a mock content section for testing the admin panel layout. It
				displays when the "Mock Item" is selected from the sidebar.
			</p>
			<div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
				<p>Sample data:</p>
				<ul className="list-disc list-inside mt-2">
					<li>Item 1</li>
					<li>Item 2</li>
					<li>Item 3</li>
				</ul>
			</div>
		</div>
	);
};

export default MockContent;

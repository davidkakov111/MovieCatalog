import React from 'react';

// Define CommentComponent as a functional component that takes a 'comment' prop
const CommentComponent: React.FC<{ comment: [{UserID: number}, string] }> = ({ comment }) => {
  // Render the comment component
  return (
    // Styling for the comment box
    <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
      {/* Display user information */}
      <p className="text-gray-700 font-bold mb-2">User {comment[0].UserID}</p>
      {/* Display comment text */}
      <p className="text-gray-700">{comment[1]}</p>
    </div>
  );
};

// Export the CommentComponent
export default CommentComponent;

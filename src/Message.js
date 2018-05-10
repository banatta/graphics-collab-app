import React from 'react';

const Message = ({chat, user}) => (
    <div className="text-left">
      <p><strong>{ chat.username }:</strong> { chat.message }</p>
    </div>
);

export default Message;
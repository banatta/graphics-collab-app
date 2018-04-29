import React from 'react';

const Message = ({chat, user}) => (
    <li>
        <div class='sentmsg'>
          <p class='username'> { chat.username } </p>
          <p class='msgtext'> {chat.message } </p>
        </div>
    </li>
);

export default Message;
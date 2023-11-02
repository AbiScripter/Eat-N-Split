import React, { useState } from "react";
import ReactDOM from "react-dom/client";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(newFriend) {
    setFriends((friends) => [...friends, newFriend]);
    //hide the addfriend form after sumbitted
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    //if already selected
    setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));
    //hide showfriendform if select button clicked
    setShowAddFriend(false);
  }

  function handleBillSplit(bill, myExpense, whoPaid, selectedFriend) {
    if (whoPaid == "user") {
      let owesYou = 0 + (bill - myExpense);
      console.log(`${selectedFriend.name} owes you ${bill - myExpense}`);
      seperate(selectedFriend, owesYou);
    } else {
      let youOwe = 0 - myExpense;
      console.log(`You owe ${selectedFriend.name} ${myExpense}`);
      seperate(selectedFriend, youOwe);
    }

    // setSelectedFriend(null);
  }

  function seperate(selectedFriend, owe) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id ? { ...friend, balance: owe } : friend
      )
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onHandleSelection={handleSelection}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          handleBillSplit={handleBillSplit}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onHandleSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onHandleSelection={onHandleSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onHandleSelection, selectedFriend }) {
  //initally no friend is selected so selectedFriend will be null, so accessing it causes error, so we use optional chaining
  const isSelected = selectedFriend?.id === friend.id;

  function handleSelectButton(friend) {
    //!already  selected
    if (isSelected) {
      onHandleSelection(null);
      return;
    }
    //else
    onHandleSelection(friend);
  }

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => handleSelectButton(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormSplitBill({ selectedFriend, handleBillSplit }) {
  const [bill, setBill] = useState("");
  const [myExpense, setMyExpense] = useState("");
  const [whoPaid, setWhoPaid] = useState("user");

  function passBillForm(e) {
    e.preventDefault();
    if (!bill || !whoPaid) return;
    handleBillSplit(bill, myExpense, whoPaid, selectedFriend);

    //resetting the state
    setBill("");
    setMyExpense("");
    setWhoPaid("user");
  }

  return (
    <form className="form-split-bill" onSubmit={passBillForm}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>Your expense</label>
      <input
        type="text"
        value={myExpense}
        onChange={(e) =>
          // {my expense should not exceed bill}
          setMyExpense(
            Number(e.target.value) > bill ? myExpense : Number(e.target.value)
          )
        }
      />

      <label>{selectedFriend.name} 's expense</label>
      <input type="text" disabled value={bill - myExpense} />

      <label>Who is Paying the bill</label>
      <select value={whoPaid} onChange={(e) => setWhoPaid(e.target.value)}>
        <option value="user">You</option>
        <option value={selectedFriend.name}>{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleAdd(e) {
    e.preventDefault();

    //guard when submitted empty
    if (!name || !image) return;

    const id = Date.now();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    console.log(newFriend);

    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleAdd}>
      <label>Friend's name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <App />
  </>
);

import React, { Component } from 'react';
import './App.css';
import rooms from './models/rooms';
import './models/enemies';
import burger from './img/burger.jpg';

class App extends Component {
  constructor() {
    super();

    this.state = {
      rooms,
      room: rooms[0],
      initText: rooms[0].initText,
      message: '',
      image: '',
      player: {
        name: 'Benson Wigglepuff',
        inventory: ['Sailor Cap', 'Fishnet Stockings']
      }
    }
    this.handleExit = this.handleExit.bind(this);
    this.handlePickup = this.handlePickup.bind(this);
    this.handleKill = this.handleKill.bind(this);
    this.hasBean = this.hasBean.bind(this);
    this.checkWeakness = this.checkWeakness.bind(this);
  }

  handleExit(room) {
    this.setState({ room, initText:room.initText, message:'' });
  }

  handlePickup(item) {
    const { room, player } = this.state;
    const index = room.items.indexOf(item);
    if (index > -1) room.items.splice(index, 1);
    player.inventory.push(item);
    if (item === 'Burger') this.setState({image:burger, message:'Benson finally has his aromatic burger. Excellent work, patriot.'})
    this.setState({ room, player })
  }

  handleKill(enemy) {
    const { room, player } = this.state;
    const index = room.enemies.indexOf(enemy);
    if (index > -1) room.enemies.splice(index, 1);
    room.enemies = null;
    this.setState({ room, player, initText:'', message: enemy.killText });
  }

  hasBean(bean) {
    return this.state.player.inventory.some(item => item === bean);
  }

  checkWeakness(enemy) {
    const { player } = this.state;
    this.setState({message:''})
    const index = player.inventory.indexOf(enemy.weakness)
    if (index > -1) {
      player.inventory.splice(index, 1)
      this.handleKill(enemy);
    } else {
      this.setState({message: 'Benson is not equipped for this fight.'})
    }
  }

  render() {
    const { player, room, initText, image, message } = this.state;
    return (
      <div className="App">
        <div className="App-header">
          <h2>Benson's Burger</h2>
          <h6>Starring {player.name}</h6>
          <h6>Benson has: {player.inventory.join(', ')}</h6>
        </div>
        <Room room={room}
          initText={initText}
          image={image}
          message={message}
          onExit={this.handleExit}
          onPickup={this.handlePickup}
          onKill={this.handleKill}
          hasBean={this.hasBean}
          checkWeakness={this.checkWeakness}
        />
      </div>
    );
  };
}

function Room({ room, image, message, initText, onExit, onPickup, onKill, hasBean, checkWeakness }) {
  return (
    <div id="room-div">
      <h2>{room.name}</h2>
      <img src={image} alt=""></img>
      <p>{initText}</p>
      {room.enemies &&
        <div>
          {room.enemies.map((enemy, i) => (
            <div>
              <p>{enemy.enemyText}</p>
              <button key={i} onClick={() => checkWeakness(enemy, enemy.weakness)}>
                Attack {enemy.name}
              </button>
            </div>
          ))}
        </div>
      }
      <p>{message}</p>
      {room.enemies === null &&
        <p>
          {room.items.map((item, i) => (
            <button key={i} onClick={() => onPickup(item)}>
              Pick up {item}
            </button>
          ))}
        </p>
      }
      {hasBean('Magic Bean') &&
        <p>{room.doors.map((door, i) => {
          return (
            <button key={i} onClick={() => onExit(door)}>
              Go to {door.name}
            </button>
          );
        })}</p>
      }
    </div>
  );
}



export default App;

import React from 'react';
import io from 'socket.io-client'
import axios from 'axios';
import { Input, Button, Table, Alert } from 'reactstrap'
const URL_API = 'https://bdo-chat-api.herokuapp.com'

// memberikan trigger koneksi soket ke BE
const socket = io(URL_API)
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notif: null,
      messages: []
    }
  }

  // FUNGSI UNTUK REQUEST JOIN CHATING

  joinChat = () => {
    // emit: mengaktifkan socket untuk mengirim pesan ke socket server, dr server ke client juga pake emit
    // mengirimkan event dan data ke socket server
    socket.emit("JoinChat", { name: this.inName.value })
    // menunggu 
    socket.on('notif', notif => this.setState({ notif }))
    socket.on("updateMessage", msgs => this.setState({ messages: msgs }))
  }

  onBtnSend = async () => {
    console.log("socket id", socket.id)
    try {
      await socket.emit("chatMessage", { name: this.inName.value, messages: this.inMessage.value })
      // await socket.on("updateMessage", msgs => axios.post(URL_API + '/add-chat', {msgs}))
      // console.log("test", this.state.messages)
      let res = await axios.post(URL_API + '/add-chat', {name: this.inName.value, messages: this.inMessage.value})
      console.log("respon", await res.data)

    } catch (error) {
      console.log(error)
    }
  }

  
  renderChat = () => {
    return this.state.messages.map(item => {
      return (
        <>
          <tr>
            <td style={{
              textAlign: item.name === this.inName.value ? 'right' : 'left',
              color: 'black',
              fontWeight: 'bold',
              backgroundColor: item.name === this.inName.value ? 'lightsalmon' : 'lightgreen'
            }}>{item.name}</td>
          </tr>
          <tr style={{
            backgroundColor: 'lightyellow'
          }}>
            <td style={{ textAlign: item.name === this.inName.value ? 'right' : 'left' }}>{item.messages}</td>
          </tr>
        </>
      )
    })
  }

  render() {
    console.log("messages in: ", this.state.messages)
    return (
      <div className="container text-center">
        <h2>Welcome to Purwadhika Chat</h2>
        <Alert isOpen={this.state.notif ? true : false} toggle={() => this.setState({ notif: null })}>
          {this.state.notif}
        </Alert>
        <div className="row">
          <span className="col-8">
            <Input type="text" placeholder="Input Nama" innerRef={el => this.inName = el} />
          </span>
          <Button className="col-3" onClick={this.joinChat}>Join Chat</Button>
        </div>
        {/* Menampilkan Pesan */}
        <Table>
          <thead>
            <th>Nama</th>
            <th><Button color="warning">Clear</Button></th>
          </thead>
          <tbody>
            {/* ISI CHAT */}
            {this.renderChat()}
          </tbody>
          <tfoot>
            {/* TEMPAT INPUT MESSAGE */}
            <td colSpan="1">
              <Input type="textarea" placeholder="Type message..." innerRef={el => this.inMessage = el} />
            </td>
            <td>
              <Button color="success" onClick={this.onBtnSend}>Send</Button>
            </td>
          </tfoot>
        </Table>
      </div>
    );
  }
}

export default App;
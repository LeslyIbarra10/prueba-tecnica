"use client";

import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import "primeicons/primeicons.css";
import "./users.css";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [seleccionar, setSeleccionarUsuario] = useState(null);
  const [search, setSearch] = useState("");


  // ESTADOS PARA PAGINACIÓN
  const [pagActual, setpagActual] = useState(1);
  const usuariosPagina = 4; // cantidad de usuarios por vista

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Filtrar por nombre
  const filtrarUsuarios = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  // LOGICA DE PAGINACIÓN
  const indiceUltUs = pagActual * usuariosPagina;
  const indexOfFirstUser = indiceUltUs - usuariosPagina;
  const currentUsers = filtrarUsuarios.slice(indexOfFirstUser, indiceUltUs);

  const totalPages = Math.ceil(filtrarUsuarios.length / usuariosPagina);

  const pagSig = () => {
    if (pagActual < totalPages) setpagActual(pagActual + 1);
  };

  const prevPage = () => {
    if (pagActual > 1) setpagActual(pagActual - 1);
  };

  return (
    <div className="main-container">
      <h2 className="title">
        <i
          className="pi pi-users"
          style={{ marginRight: "10px", color: "#4338ca" }}
        ></i>
        Lista de Usuarios
      </h2>
      <InputText
        type="text"
        placeholder="Buscar por nombre..."
        className="search-inputText"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setpagActual(1); // reinicia a la pagina 1
        }}
      ></InputText>
      <div className="users-grid">
        {currentUsers.map((user) => (
          <div
            key={user.id}
            className="user-card"
            onClick={() => setSeleccionarUsuario(user)}
          >
            <div className="avatar">{user.name[0]}</div>
            <h3>{user.name}</h3>
            <p className="username">@{user.username}</p>
            <p className="email">{user.email}</p>
          </div>
        ))}
      </div>

      {/* PAGINACIÓN */}
      <div className="paginacion">
        <Button
          label="Anterior"
          icon="pi pi-angle-left"
          onClick={prevPage}
          disabled={pagActual === 1}
        />
        <span className="page-info">
          Página {pagActual} de {totalPages}
        </span>
        <Button
          label="Siguiente"
          icon="pi pi-angle-right"
          iconPos="right"
          onClick={pagSig}
          disabled={pagActual === totalPages}
        />
      </div>

      {/* MODAL DE DETALLES */}
      {seleccionar && (
        <div
          className="modal-overlay"
          onClick={() => setSeleccionarUsuario(null)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <Button
              icon="pi pi-times-circle"
              className="close-button"
              onClick={() => setSeleccionarUsuario(null)}
            ></Button>

            <h2>{seleccionar.name}</h2>
            <p className="username">@{seleccionar.username}</p>

            <h3>
              <i
                className="pi pi-user"
                style={{ marginRight: "10px", color: "#14af54ff" }}
              ></i>
              Contacto
            </h3>
            <p>Email: {seleccionar.email}</p>
            <p>Tel: {seleccionar.phone}</p>
            <p>Website: {seleccionar.website}</p>

            <h3>
              <i
                className="pi pi-home"
                style={{ marginRight: "10px", color: "#14af54ff" }}
              ></i>
              Dirección
            </h3>
            <p>{seleccionar.address.street}</p>
            <p>{seleccionar.address.suite}</p>
            <p>{seleccionar.address.city}</p>
            <p>{seleccionar.address.zipcode}</p>

            <h3>
              <i
                className="pi pi-building"
                style={{ marginRight: "10px", color: "#14af54ff" }}
              ></i>
              Empresa
            </h3>
            <p>
              <strong>{seleccionar.company.name}</strong>
            </p>
            <p>{seleccionar.company.catchPhrase}</p>
          </div>
        </div>
      )}
    </div>
  );
}

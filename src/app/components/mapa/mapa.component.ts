import { Component, OnInit } from '@angular/core';
import { Marcador } from '../../classes/marcador.class';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MapaEditarComponent } from './mapa-editar.component';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  marcadores: Marcador[] = [];

  lat = 43.264177;
  lng = -2.947907;


  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    if (this.recuperarStorage()) {
      this.marcadores = JSON.parse(this.recuperarStorage());
    } else {
      const sanMames = new Marcador(this.lat, this.lng, 'San Mames', 'El mejor estadio del mundo mundial');
      this.marcadores.push(sanMames);
    }
  }

  ngOnInit() {
  }

  agregarMarcador(evento) {
    // console.log(evento);

    const coords: { lat: number, lng: number } = evento.coords;

    this.marcadores.push(new Marcador(coords.lat, coords.lng));

    this.guardarStorage();

    this.snackBar.open('Marcador agregado', 'Cerrar', { duration: 3000 });
  }


  guardarStorage() {
    localStorage.setItem('marcadores', JSON.stringify(this.marcadores));
  }

  recuperarStorage() {
    return localStorage.getItem('marcadores');
  }

  borrarMarcador(i: number) {
    if (i === 0) {
      this.snackBar.open('San Mames no se puede borrar', 'Cerrar', { duration: 3000 });
    } else {
      this.marcadores.splice(i, 1);
      this.guardarStorage();
      this.snackBar.open('Marcador borrado', 'Cerrar', { duration: 3000 });
    }
  }

  editarMarcador(marcador: Marcador, i: number) {
    if (i === 0) {
      this.snackBar.open('San Mames no se puede editar', 'Cerrar', { duration: 3000 });
    } else {
      const dialogRef = this.dialog.open(MapaEditarComponent, {
        width: '250px',
        data: { titulo: marcador.titulo, desc: marcador.desc }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (!result) { return; }
        marcador.titulo = result.titulo;
        marcador.desc = result.desc;

        this.guardarStorage();

        this.snackBar.open('Marcador actualizado', 'Cerrar', { duration: 3000 });
      });
    }
  }
}

import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home.component';
// import user
import { UserEditComponent } from './components/user-edit.component';
// import artist
import { ArtistListComponent } from './components/artist-list.component';
// import artist add
import { ArtistAddComponent } from './components/artist-add.component';
// import artist edit
import { ArtistEditComponent } from './components/artist-edit.component';
// import artist detail
import { ArtistDetailComponent } from './components/artist-detail.component';

const appRoutes: Routes = [
  //{ path: '', redirectTo: '/artistas/1', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'artistas/:page', component: ArtistListComponent },
  { path: 'crear-artista', component: ArtistAddComponent },
  { path: 'editar-artista/:id', component: ArtistEditComponent },
  { path: 'artista/:id', component: ArtistDetailComponent },
  { path: 'mis-datos', component: UserEditComponent },
  { path: '**', component: HomeComponent } //cualquier ruta no configurada
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

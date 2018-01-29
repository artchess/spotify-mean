import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})

export class AppComponent implements OnInit {
  public title = 'Spotify';
  public user: User;
  public userRegister: User;
  public identity; // el objeto del usuario logeado
  public token;
  public errorMessage;
  public alertRegister;

  constructor(private _userService: UserService) {
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.userRegister = new User('', '', '', '', '', 'ROLE_USER', '');
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    console.log(this.identity);
    console.log(this.token);
  }

  public onSubmit() {
    console.log(this.user);

    //conseguir los datos del usuario identificado
    this._userService.signup(this.user).subscribe(
      resp => {
        let identity = resp.user;
        this.identity = identity;

        if (!this.identity._id) {
          alert("El usuario no esta correctamente identificado");
        } else {
          //Crear elemento en el localstorage para tener al usuario en sesión
          localStorage.setItem('identity', JSON.stringify(identity));

          // Conseguir el token para enviarselo a cada petición http
          this._userService.signup(this.user, true).subscribe(
            resp => {
              let token = resp.token;
              this.token = token;

              if (this.token.length <= 0) {
                alert("El token no se ha generado correctamente");
              } else {
                //Crear elemento en el localstorage para tener el token disponible
                localStorage.setItem('token', token);
                this.user = new User('', '', '', '', '', 'ROLE_USER', '');
              }
            },
            error => {
              var errorMessage = <any>error;

              if (errorMessage != null) {
                var body = JSON.parse(error._body);
                this.errorMessage = body.message;
                console.log(error);
              }
            }
          );

        }
      },
      error => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
          console.log(error);
        }
      }
    );
  }

  logout() {
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();

    this.identity = null;
    this.token = null;
  }

  onSubmitRegister() {
    this._userService.register(this.userRegister).subscribe(
      response => {
        let user = response.user;
        this.userRegister = user;

        if (!user._id) {
          this.alertRegister = 'error al registrarse';
        } else {
          this.alertRegister = 'El registro se ha realizado correctamente, identifícate con ' + this.userRegister.email;
          this.userRegister = new User('', '', '', '', '', 'ROLE_USER', '');
        }
      },
      error => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = JSON.parse(error._body);
          this.alertRegister = body.message;
          console.log(error);
        }
      }
      );
  }
}

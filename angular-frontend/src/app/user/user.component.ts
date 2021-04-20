import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventBrokerService } from 'ng-event-broker';
import Swal from 'sweetalert2';
import { Events } from '../events.model'
import { LoginService } from '../login/login.service';
import { RegisterService } from '../register/register.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  username: string = '';

  password: String;

  newPassword1: String;

  newPassword2: String;

  deletePassword: String = '';

  constructor(
    private eventService: EventBrokerService,
    private registerService: RegisterService,
    private loginService: LoginService,
    private router: Router
  ) 
  {
      this.password = '';
      this.newPassword1 = '';
      this.newPassword2 = '';
  }

  ngOnInit(): void {
    const localUsername = localStorage.getItem('username');
    if(localUsername) {
      this.username = localUsername;
    } else {
      const validator = function(username: String) {
        if(!username) {
          return 'Kérlek add meg a felhasználóneved!';
        }
        return null;
      }
      //valamiért nincs a local storage-ban
      Swal.fire(
        {
          title: 'Felhasználónév',
          text: 'Valamiért nem találom a felhasználónevedet. Kérlek add meg!',
          icon: 'question',
          input: 'text',
          inputValue: this.username,
          inputPlaceholder: 'felhasználónév...',
          focusCancel: false,
          inputValidator: validator
        }
      );
    }
  }

  onUpdatePasswordClicked() {
    if(this.password == '') {
      Swal.fire({
        title: 'Hiányos adatok!',
        text: 'Meg kell adnod a jelenlegi jelszót!',
        icon: 'error'
      });
      return;
    }
    if(this.newPassword1 === '' || this.newPassword2 === '') {
      Swal.fire({
        title: 'Hibás adatok!',
        text: 'Meg kell adnod az új jelszót!',
        icon: 'error'
      });
      return;
    }
    if(this.newPassword1 !== this.newPassword2) {
      Swal.fire({
        title: 'Hibás adatok!',
        text: 'A új jelszónak és a megerősítő jelszónak meg kell egyezniük!',
        icon: 'error'
      });
      return;
    }
     //töltés mutatása
     this.eventService.publishEvent(Events.showLoading);

     this.registerService.updateUserPassword(this.username, this.password, this.newPassword1)
     .subscribe(response => {
        this.eventService.publishEvent(Events.hideLoading);
        Swal.fire(
          {
            icon: 'success',
            title: 'Siker',
            text: 'A jelszavad megváltozott!'
          }
        );
        this.password = '';
        this.newPassword1 = '';
        this.newPassword2 = '';
     }, error => {
        this.eventService.publishEvent(Events.hideLoading);
        //nem sikerült
        Swal.fire(
          {
            icon: 'error',
            title: 'Jelszóváltási hiba!',
            text: error.error.message
            
          }
        );
     });
  }

  onDeleteUser() {
    //meg van-e adva a jelszó?
    if(this.deletePassword === '') {
      Swal.fire(
        {
          icon: 'error',
          title: 'Jelszó',
          text: 'Meg kell adnod a jelszavadat a törléshez!'
        }
      );
      return;
    }
    Swal.fire({
      title: 'Biztos vagy ebben?',
      text: "Ezután ki leszen jelentkeztetve, és a törlés nem vonható vissza!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Törlés',
      cancelButtonText: 'Mégse'
    }).then((result) => {
      if (result.isConfirmed) {
          //meg van erősítve
          this.eventService.publishEvent(Events.showLoading);
          this.registerService.deleteUser(this.username, this.deletePassword)
          .subscribe(response => {
              this.eventService.publishEvent(Events.hideLoading);
              //törölve
              Swal.fire({
                icon: 'success',
                title: 'Siker',
                text: 'A fiókod törölve lett, most ki leszed jelentkeztetve.'
              });
              //kijelentkeztetés
              this.loginService.logout().subscribe(message => {
                //logout esemény küldése
                this.eventService.publishEvent(Events.logout);
                this.router.navigate(['login']);
              }, error => {
                alert('Sikertelen kijelentkezés: ' + error);
              });
          }, error => {
              this.eventService.publishEvent(Events.hideLoading);
              //valamiért nem sikerült a törlés
              Swal.fire({
                icon: 'error',
                title: 'Sikertelen törlés',
                text: error.error.message
              });
          });
      }
    })
  }
}

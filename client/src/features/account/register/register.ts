import { Component, inject, input, output, signal } from '@angular/core';
import { RegisterCreds, User } from '../../../Types/user';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  protected accountService = inject(AccountService)
  cancelRegister = output<boolean>()
  protected creds ={} as RegisterCreds

  register(){
    this.accountService.register(this.creds).subscribe({
      next: response => {
        console.log(response)
        this.cancel()
      },
      error: error => console.log(error)
    })
  }

  cancel(){
    console.log('canceled');
    this.cancelRegister.emit(false)
  }

}

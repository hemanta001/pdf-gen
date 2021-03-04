import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {DemoMaterialModule} from './material.module';
import {PdfViewerModule} from './pdf-viewer/pdf-viewer.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {AngularResizedEventModule} from "angular-resize-event";
import {UploadConvertComponent} from './upload-convert/upload-convert.component';
import {PdfDownloadComponent} from "./pdfDownload/pdf-download.component";
import {RouterModule} from "@angular/router";
import {AddUserInfoComponent} from './add-user-info/add-user-info.component';
import {ModalOrganizationComponent} from "./modals/modal-organization/modal-organization.component";
import {OrganizationService} from "./organization/service/organization.service";
import { LoginComponent } from './auth/login/login.component';
import {AuthGuard} from "./auth/auth.guard";

@NgModule({
  declarations: [AppComponent, UploadConvertComponent, PdfDownloadComponent, AddUserInfoComponent, ModalOrganizationComponent, LoginComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    DragDropModule,
    NoopAnimationsModule,
    RouterModule.forRoot([{
      path: '',
      component: UploadConvertComponent,
      canActivate: [AuthGuard]
    },
      {
        path: 'pdf-download',
        component: PdfDownloadComponent
      },
      {
        path: 'add-info',
        component: AddUserInfoComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'login',
        component: LoginComponent
      }]),

    DemoMaterialModule,
    AngularResizedEventModule,
    PdfViewerModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

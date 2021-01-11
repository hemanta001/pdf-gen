import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {DemoMaterialModule} from './material.module';
import {PdfViewerModule} from './pdf-viewer/pdf-viewer.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {AngularResizedEventModule} from "angular-resize-event";
import { UploadConvertComponent } from './upload-convert/upload-convert.component';

@NgModule({
  declarations: [AppComponent, UploadConvertComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    DragDropModule,
    NoopAnimationsModule,
    DemoMaterialModule,
    AngularResizedEventModule,
    PdfViewerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
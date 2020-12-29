import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DemoMaterialModule } from './material.module';
import { PdfViewerModule } from './pdf-viewer/pdf-viewer.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { UploadConvertComponent } from './upload-convert/upload-convert.component';

@NgModule({
  declarations: [AppComponent, UploadConvertComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NoopAnimationsModule,
    DemoMaterialModule,

    PdfViewerModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

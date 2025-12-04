import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  imports: [],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css',
})
export class ImageUpload {
  protected imageSrc = signal<string | ArrayBuffer | null | undefined>(null)
  protected isDraging = false
  private fileToUpload: File | null = null
  uploadFile = output<File>()
  loading = input<boolean>(false)

  onDragOver(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.isDraging = true
  }
  onDragLeave(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.isDraging = false
  }
  onDrop(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.isDraging = false

    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0]
      this.previewImage(file)
      this.fileToUpload = file
    }
  }

  onCancel() {
    this.fileToUpload = null
    this.imageSrc.set(null)
  }

  onUploadFile(){
    if(this.fileToUpload){
      this.uploadFile.emit(this.fileToUpload)
    }
  }

  private previewImage(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => this.imageSrc.set(e.target?.result)
    reader.readAsDataURL(file)
  }
}

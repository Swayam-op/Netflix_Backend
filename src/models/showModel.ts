import { shows } from "../types/show.enum";
import prisma from "../utils/db";

class Show {
  title: string;
  thumbnail: string;
  bgImage: string;
  releaseDate: string;
  genre: string;
  description: string;
  isPaid: boolean;
  isAvailable: boolean;
  showsType: shows;

  constructor(
    title: string,
    thumbnail: string,
    bgImage: string,
    releaseDate: string,
    genre: string,
    description: string,
    isPaid: boolean,
    isAvailable: boolean,
    showsType: shows
  ) {
    this.title = title
    this.thumbnail = thumbnail
    this.releaseDate = releaseDate
    this.bgImage = bgImage
    this.genre = genre
    this.description = description
    this.isPaid = isPaid
    this.isAvailable = isAvailable
    this.showsType = showsType
  }

  

}

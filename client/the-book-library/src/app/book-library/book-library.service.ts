import { Injectable } from "@angular/core";
import { Query } from "apollo-angular";
import gql from "graphql-tag";

export interface Book {
  title: string;
  author: Author;
  description: string;
}

export interface Author {
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: "root"
})
export class BookLibraryService extends Query<Response> {
  document = gql`
    {
      books {
        title
        description
        author {
          firstName
          lastName
        }
      }
    }
  `;
}

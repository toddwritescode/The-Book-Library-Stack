import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Book, Author, BookLibraryService } from "./book-library.service";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";

@Component({
  selector: "app-book-library",
  templateUrl: "./book-library.component.html",
  styleUrls: ["./book-library.component.css"]
})
export class BookLibraryComponent implements OnInit {
  public loading = false;
  public error = null;
  public books: Observable<Book[]>;
  public bookForm: FormGroup;

  constructor(
    private _apolloSvc: Apollo,
    private _allBooksGQL: BookLibraryService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    // successful simple example
    // this.books = this._apolloSvc
    //   .watchQuery({
    //     query: gql`
    //       {
    //         books {
    //           title
    //           description
    //           author {
    //             firstName
    //             lastName
    //           }
    //         }
    //       }
    //     `
    //   })
    //   .valueChanges.pipe(map((result: any) => result.data.books));

    // successful using document from service
    // this.books = this._apolloSvc.watchQuery({
    //   query: this._allBooksGQL.document
    // })
    // .valueChanges.pipe(map((result: any) => result.data.books));

    // successful calling service
    this.books = this._allBooksGQL.watch().valueChanges.pipe(
      map((result: any) => {
        this.loading = result.loading;
        this.error = result.error;
        return result.data.books;
      })
    );

    this.bookForm = this.createForm();
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      title: "",
      description: "",
      author: {
        firstName: "",
        lastName: ""
      }
    });
  }

  // return author or 'unknown' based on author object returned in graphql call
  getAuthor(author: Author) {
    if (!!author) {
      return `${!!author.firstName ? author.firstName : ""} ${
        !!author.lastName ? author.lastName : ""
      }`;
    } else {
      return "Unknown";
    }
  }

  createBook() {
    this.bookForm.patchValue({
      author: {
        firstName: "Todd",
        lastName: "Smyth"
      }
    });

    const bookValue = this.bookForm.value;
    console.log(this.bookForm.value);

    this._apolloSvc.mutate({
      mutation: gql`
        mutation createBook(
          $title: String!
          $description: String!
          $authorFName: String!
          $authorLName: String!
        ) {
          createBook(
            title: $title
            description: $description
            authorFName: $authorFName
            authorLName: $authorLName
          ) {
            id
            title
            description
            author {
              firstName
              lastName
            }
          }
        }
      `,
      variables: {
        title: bookValue.title,
        description: bookValue.description,
        authorFName: bookValue.author.firstName,
        authorLName: bookValue.author.lastName
      }
    }).subscribe(
      ({ data }) => {
        console.log("got data", data);
      },
      error => {
        console.log("there was an error sending the query", error);
      }
    );
  }
}

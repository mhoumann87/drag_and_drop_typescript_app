/*
 * Project manager overview system made in an OOP style
 */

// ? Decorators
function Autobind(
  _: any,
  _2: string | Symbol | number,
  descriptor: PropertyDescriptor
) {
  // get the original method descriptor
  const originalMethod = descriptor.value;

  // Create a new descriptor for the method
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,

    get() {
      // Bind this
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  // Return the new descriptor with the binding
  return adjustedDescriptor;
}

// ? Classes
//? Render the form on the web page
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    // Set up the elements for rendering
    this.templateElement = document.getElementById(
      'project-input'
    )! as HTMLTemplateElement;

    // Get the element where to render the elements
    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    // Get the content from the template
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    this.element = importedNode.firstElementChild as HTMLFormElement;
    // give the element an Id for style
    this.element.id = 'user-input';

    // * Get the input elements on the page
    this.titleInputElement = this.element.querySelector(
      '#title'
    ) as HTMLInputElement;

    this.descriptionInputElement = this.element.querySelector(
      '#description'
    ) as HTMLInputElement;

    this.peopleInputElement = this.element.querySelector(
      '#people'
    ) as HTMLInputElement;

    // Call the method to add the event listener
    this.configure();
    // Call the method to attach the element to the page
    this.attach();
  }

  // Method to get and validate user input
  getAndValidateUserInput(): [string, string, number] {}

  // Function to get info from input element on submit
  // to get this method to work, we need bo bind the 'this'
  // we are using an autobind decorator
  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    // Get the user input
    this.getAndValidateUserInput();
  }

  // Set up event listener for submit on form
  private configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

// ? Instantiate the ProjectInput class
const prjInput = new ProjectInput();

// ?

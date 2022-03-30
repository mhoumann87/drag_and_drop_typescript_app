/*
 * Project manager overview system made in an OOP style
 */

// ? Interfaces
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

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

// ? Global functions

// ? Validate input
const validate = (validatableInput: Validatable) => {
  let isValid = true;

  // Go through the items to validate
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }

  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === 'string'
  ) {
    isValid =
      isValid && validatableInput.value.length > validatableInput.minLength;
  }

  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === 'string'
  ) {
    isValid =
      isValid && validatableInput.value.length < validatableInput.maxLength;
  }

  if (
    validatableInput.min != null &&
    typeof validatableInput.value === 'number'
  ) {
    isValid = isValid && validatableInput.value > validatableInput.min;
  }

  if (
    validatableInput.max != null &&
    typeof validatableInput.value === 'number'
  ) {
    isValid = isValid && validatableInput.value < validatableInput.max;
  }
  return isValid;
};

// ? Classes

//? Project state management class
class ProjectState {
  private listeners: any[] = [];
  private projects: any[] = [];
  private static instance: ProjectState;

  private constructor() {}

  // * Create a singleton, so we are sure to only have one instance of
  // * the ProjectState
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  //* Add listener to the  array of listeners
  addListener(listenerFn: Function) {
    this.listeners.push(listenerFn);
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = {
      id: (Math.random() * 100).toString(),
      title,
      description,
      people: numOfPeople,
    };

    this.projects.push(newProject);

    for (const listnerFn of this.listeners) {
      listnerFn(this.projects.slice());
    }
  }
}

// * Initialize a new ProjectState as a global variable, so we can use it
// * all over the project
const projectState = ProjectState.getInstance();

// ? Rendering the List
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  assignedProjects: any[];

  constructor(private type: 'active' | 'finished') {
    this.templateElement = document.getElementById(
      'project-list'
    )! as HTMLTemplateElement;

    this.hostElement = document.getElementById('app')! as HTMLDivElement;
    this.assignedProjects = [];

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;

    // Add the new project to the new array
    projectState.addListener((projects: any[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    });

    this.attach();
    this.renderContent();
  }

  // Method to create the elements in the list element
  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-project-list`
    )! as HTMLUListElement;

    for (const prjItem of this.assignedProjects) {
      const listItem = document.createElement('li');
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector(
      'h2'
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }

  private attach() {
    this.hostElement.insertAdjacentElement('beforeend', this.element);
  }
}

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
  private getAndValidateUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    // Validate objects
    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 6,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert('Invalid input - please try again');
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  // Method to clear the input fields
  clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  // Method to get info from input element on submit
  // to get this method to work, we need bo bind the 'this'
  // we are using an autobind decorator
  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    // Get the user input
    const userInput = this.getAndValidateUserInput();
    // Check to see if we get the tuple (array in JS) as a return value
    if (Array.isArray(userInput)) {
      // deconstructing of the array
      const [title, desc, people] = userInput;
      projectState.addProject(title, desc, people);
      this.clearInputs();
    }
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
// ? Instantiate the ProjectLists
const activeProjList = new ProjectList('active');
const finishedProjList = new ProjectList('finished');

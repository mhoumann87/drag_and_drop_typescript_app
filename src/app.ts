/*
 * Project manager overview system made in an OOP style
 */

//? Render the form on the web page
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;

  constructor() {
    // Set up the elements for rendering
    this.templateElement = document.getElementById(
      'project-input'
    )! as HTMLTemplateElement;

    // Get the element where to render the elements
    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    // Get the content from the template
    const importedtNode = document.importNode(
      this.templateElement.content,
      true
    );

    this.element = importedtNode.firstElementChild as HTMLFormElement;

    // Call the method to attach the element to the page
    this.attach();
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

const prjInput = new ProjectInput();

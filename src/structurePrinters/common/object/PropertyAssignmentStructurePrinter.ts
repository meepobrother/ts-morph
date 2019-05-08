import { CodeBlockWriter } from "../../../codeBlockWriter";
import { PropertyAssignmentStructure, OptionalKind } from "../../../structures";
import { printTextFromStringOrWriter } from "../../../utils";
import { NodePrinter } from "../../NodePrinter";

export class PropertyAssignmentStructurePrinter extends NodePrinter<OptionalKind<PropertyAssignmentStructure>> {
    protected printTextInternal(writer: CodeBlockWriter, structure: OptionalKind<PropertyAssignmentStructure>) {
        writer.withQueuedIndentationLevel(writer.getIndentationLevel() + 1, () => {
            writer.write(`${structure.name}: `);
            printTextFromStringOrWriter(writer, structure.initializer);
        });
    }
}

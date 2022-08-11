import CodeMirror from 'codemirror';

const instructions = {
    'add': 'Add two values, returning a new value (0x58)',
    'add.ovf': 'Add signed integer values with overflow check (0xD6)',
    'add.ovf.un': 'Add unsigned integer values with overflow check (0xD7)',
    'and': 'Bitwise AND of two integral values, returns an integral value (0x5F)',
    'arglist': 'Return argument list handle for the current method (0xFE 0x00)',
    'beq': 'Branch to target if equal (0x3B <int32>)',
    'beq.s': 'Branch to target if equal, short form (0x2E <int8>)',
    'bge': 'Branch to target if greater than or equal to (0x3C <int32>)',
    'bge.s': 'Branch to target if greater than or equal to, short form (0x2F <int8>)',
    'bge.un': 'Branch to target if greater than or equal to (unsigned or unordered) (0x41 <int32>)',
    'bge.un.s': 'Branch to target if greater than or equal to (unsigned or unordered), short form (0x34 <int8>)',
    'bgt': 'Branch to target if greater than (0x3D <int32>)',
    'bgt.s': 'Branch to target if greater than, short form (0x30 <int8>)',
    'bgt.un': 'Branch to target if greater than (unsigned or unordered) (0x42 <int32>)',
    'bgt.un.s': 'Branch to target if greater than (unsigned or unordered), short form (0x35 <int8>)',
    'ble': 'Branch to target if less than or equal to (0x3E <int32>)',
    'ble.s': 'Branch to target if less than or equal to, short form (0x31 <int8>)',
    'ble.un': 'Branch to target if less than or equal to (unsigned or unordered) (0x43 <int32>)',
    'ble.un.s': 'Branch to target if less than or equal to (unsigned or unordered), short form (0x36 <int8>)',
    'blt': 'Branch to target if less than (0x3F <int32>)',
    'blt.s': 'Branch to target if less than, short form (0x32 <int8>)',
    'blt.un': 'Branch to target if less than (unsigned or unordered) (0x44 <int32>)',
    'blt.un.s': 'Branch to target if less than (unsigned or unordered), short form (0x37 <int8>)',
    'bne.un': 'Branch to target if unequal or unordered (0x40 <int32>)',
    'bne.un.s': 'Branch to target if unequal or unordered, short form (0x33 <int8>)',
    'box': 'Convert a boxable value to its boxed form (0x8B <T>)',
    'br': 'Branch to target (0x38 <int32>)',
    'br.s': 'Branch to target, short form (0x2B <int8>)',
    'break': 'Inform a debugger that a breakpoint has been reached (0x01)',
    'brfalse': 'Branch to target if value is zero (false) (0x39 <int32>)',
    'brfalse.s': 'Branch to target if value is zero (false), short form (0x2C <int8>)',
    'brinst': 'Branch to target if value is a non-null object reference (alias for brtrue) (0x3A <int32>)',
    'brinst.s': 'Branch to target if value is a non-null object reference, short form (alias for brtrue.s) (0x2D <int8>)',
    'brnull': 'Branch to target if value is null (alias for brfalse) (0x39 <int32>)',
    'brnull.s': 'Branch to target if value is null (alias for brfalse.s), short form (0x2C <int8>)',
    'brtrue': 'Branch to target if value is non-zero (true) (0x3A <int32>)',
    'brtrue.s': 'Branch to target if value is non-zero (true), short form (0x2D <int8>)',
    'brzero': 'Branch to target if value is zero (alias for brfalse) (0x39 <int32>)',
    'brzero.s': 'Branch to target if value is zero (alias for brfalse.s), short form (0x2C <int8>)',
    'call': 'Call method indicated on the stack with arguments (0x28 <T>)',
    'callvirt': 'Call a late-bound method on an object (0x6F <T>)',
    'castclass': 'Cast obj to class (0x74 <T>)',
    'ceq': 'Push 1 (of type int32) if value1 equals value2, else push 0 (0xFE 0x01)',
    'cgt': 'Push 1 (of type int32) if value1 > value2, else push 0 (0xFE 0x02)',
    'cgt.un': 'Push 1 (of type int32) if value1 > value2, unsigned or unordered, else push 0 (0xFE 0x03)',
    'ckfinite': 'Throw ArithmeticException if value is not a finite number (0xC3)',
    'clt': 'Push 1 (of type int32) if value1 < value2, else push 0 (0xFE 0x04)',
    'clt.un': 'Push 1 (of type int32) if value1 < value2, unsigned or unordered, else push 0 (0xFE 0x05)',
    'constrained': 'Call a virtual method on a type constrained to be type T (0xFE 0x16 <T>)',
    'conv.i': 'Convert to native int, pushing native int on stack (0xD3)',
    'conv.i1': 'Convert to int8, pushing int32 on stack (0x67)',
    'conv.i2': 'Convert to int16, pushing int32 on stack (0x68)',
    'conv.i4': 'Convert to int32, pushing int32 on stack (0x69)',
    'conv.i8': 'Convert to int64, pushing int64 on stack (0x6A)',
    'conv.ovf.i': 'Convert to a native int (on the stack as native int) and throw an exception on overflow (0xD4)',
    'conv.ovf.i.un': 'Convert unsigned to a native int (on the stack as native int) and throw an exception on overflow (0x8A)',
    'conv.ovf.i1': 'Convert to an int8 (on the stack as int32) and throw an exception on overflow (0xB3)',
    'conv.ovf.i1.un': 'Convert unsigned to an int8 (on the stack as int32) and throw an exception on overflow (0x82)',
    'conv.ovf.i2': 'Convert to an int16 (on the stack as int32) and throw an exception on overflow (0xB5)',
    'conv.ovf.i2.un': 'Convert unsigned to an int16 (on the stack as int32) and throw an exception on overflow (0x83)',
    'conv.ovf.i4': 'Convert to an int32 (on the stack as int32) and throw an exception on overflow (0xB7)',
    'conv.ovf.i4.un': 'Convert unsigned to an int32 (on the stack as int32) and throw an exception on overflow (0x84)',
    'conv.ovf.i8': 'Convert to an int64 (on the stack as int64) and throw an exception on overflow (0xB9)',
    'conv.ovf.i8.un': 'Convert unsigned to an int64 (on the stack as int64) and throw an exception on overflow (0x85)',
    'conv.ovf.u': 'Convert to a native unsigned int (on the stack as native int) and throw an exception on overflow (0xD5)',
    'conv.ovf.u.un': 'Convert unsigned to a native unsigned int (on the stack as native int) and throw an exception on overflow (0x8B)',
    'conv.ovf.u1': 'Convert to an unsigned int8 (on the stack as int32) and throw an exception on overflow (0xB4)',
    'conv.ovf.u1.un': 'Convert unsigned to an unsigned int8 (on the stack as int32) and throw an exception on overflow (0x86)',
    'conv.ovf.u2': 'Convert to an unsigned int16 (on the stack as int32) and throw an exception on overflow (0xB6)',
    'conv.ovf.u2.un': 'Convert unsigned to an unsigned int16 (on the stack as int32) and throw an exception on overflow (0x87)',
    'conv.ovf.u4': 'Convert to an unsigned int32 (on the stack as int32) and throw an exception on overflow (0xB8)',
    'conv.ovf.u4.un': 'Convert unsigned to an unsigned int32 (on the stack as int32) and throw an exception on overflow (0x88)',
    'conv.ovf.u8': 'Convert to an unsigned int64 (on the stack as int64) and throw an exception on overflow (0xBA)',
    'conv.ovf.u8.un': 'Convert unsigned to an unsigned int64 (on the stack as int64) and throw an exception on overflow (0x89)',
    'conv.r.un': 'Convert unsigned integer to floating-point, pushing F on stack (0x76)',
    'conv.r4': 'Convert to float32, pushing F on stack (0x6B)',
    'conv.r8': 'Convert to float64, pushing F on stack (0x6C)',
    'conv.u': 'Convert to native unsigned int, pushing native int on stack (0xE0)',
    'conv.u1': 'Convert to unsigned int8, pushing int32 on stack (0xD2)',
    'conv.u2': 'Convert to unsigned int16, pushing int32 on stack (0xD1)',
    'conv.u4': 'Convert to unsigned int32, pushing int32 on stack (0x6D)',
    'conv.u8': 'Convert to unsigned int64, pushing int64 on stack (0x6E)',
    'cpblk': 'Copy data from memory to memory (0xFE 0x17)',
    'cpobj': 'Copy a value type from src to dest (0x70 <T>)',
    'div': 'Divide two values to return a quotient or floating-point result (0x5B)',
    'div.un': 'Divide two values, unsigned, returning a quotient (0x5C)',
    'dup': 'Duplicate the value on the top of the stack (0x25)',
    'endfault': 'End fault clause of an exception block (alias for endfilter) (0xFE 0x11)',
    'endfilter': 'End an exception handling filter clause (0xFE 0x11)',
    'endfinally': 'End finally clause of an exception block (0xDC)',
    'initblk': 'Set all bytes in a block of memory to a given byte value (0xFE 0x18)',
    'initobj': 'Initialize the value at address dest (0xFE 0x15 <T>)',
    'isinst': 'Test if obj is an instance of class, returning null or an instance of that class or interface (0x75 <T>)',
    'jmp': 'Exit current method and jump to the specified method (0x27 <T>)',
    'ldarg': 'Load argument numbered num onto the stack (0xFE 0x09 <uint16>)',
    'ldarg.0': 'Load argument 0 onto the stack (0x02)',
    'ldarg.1': 'Load argument 1 onto the stack (0x03)',
    'ldarg.2': 'Load argument 2 onto the stack (0x4)',
    'ldarg.3': 'Load argument 3 onto the stack (0x5)',
    'ldarg.s': 'Load argument numbered num onto the stack, short form (0x0E <uint8>)',
    'ldarga': 'Fetch the address of argument argNum (0xFE 0x0A <uint16>)',
    'ldarga.s': 'Fetch the address of argument argNum, short form (0x0F <uint8>)',
    'ldc.i4': 'Push num of type int32 onto the stack as int32 (0x20 <int32>)',
    'ldc.i4.0': 'Push 0 onto the stack as int32 (0x16)',
    'ldc.i4.1': 'Push 1 onto the stack as int32 (0x17)',
    'ldc.i4.2': 'Push 2 onto the stack as int32 (0x18)',
    'ldc.i4.3': 'Push 3 onto the stack as int32 (0x19)',
    'ldc.i4.4': 'Push 4 onto the stack as int32 (0x1A)',
    'ldc.i4.5': 'Push 5 onto the stack as int32 (0x1B)',
    'ldc.i4.6': 'Push 6 onto the stack as int32 (0x1C)',
    'ldc.i4.7': 'Push 7 onto the stack as int32 (0x1D)',
    'ldc.i4.8': 'Push 8 onto the stack as int32 (0x1E)',
    'ldc.i4.m1': 'Push -1 onto the stack as int32 (0x15)',
    'ldc.i4.M1': 'Push -1 of type int32 onto the stack as int32 (alias for ldc.i4.m1) (0x15)',
    'ldc.i4.s': 'Push num onto the stack as int32, short form (0x1F <int8>)',
    'ldc.i8': 'Push num of type int64 onto the stack as int64 (0x21 <int64>)',
    'ldc.r4 ': 'Push num of type float32 onto the stack as F (0x22 <float32>)',
    'ldc.r8': 'Push num of type float64 onto the stack as F (0x23 <float64>)',
    'ldelem': 'Load the element at index onto the top of the stack (0xA3 <T>)',
    'ldelem.i': 'Load the element with type native int at index onto the top of the stack as a native int (0x97)',
    'ldelem.i1': 'Load the element with type int8 at index onto the top of the stack as an int32 (0x90)',
    'ldelem.i2': 'Load the element with type int16 at index onto the top of the stack as an int32 (0x92)',
    'ldelem.i4': 'Load the element with type int32 at index onto the top of the stack as an int32 (0x94)',
    'ldelem.i8': 'Load the element with type int64 at index onto the top of the stack as an int64 (0x96)',
    'ldelem.r4': 'Load the element with type float32 at index onto the top of the stack as an F (0x98)',
    'ldelem.r8': 'Load the element with type float64 at index onto the top of the stack as an F (0x99)',
    'ldelem.ref': 'Load the element at index onto the top of the stack as an O. The type of the O is the same as the element type of the array pushed on the CIL stack (0x9A)',
    'ldelem.u1': 'Load the element with type unsigned int8 at index onto the top of the stack as an int32 (0x91)',
    'ldelem.u2': 'Load the element with type unsigned int16 at index onto the top of the stack as an int32 (0x93)',
    'ldelem.u4': 'Load the element with type unsigned int32 at index onto the top of the stack as an int32 (0x95)',
    'ldelem.u8': 'Load the element with type unsigned int64 at index onto the top of the stack as an int64 (alias for ldelem.i8) (0x96)',
    'ldelema': 'Load the address of element at index onto the top of the stack (0x8F <T>)',
    'ldfld': 'Push the value of field of object (or value type) obj, onto the stack (0x7B)',
    'ldflda': 'Push the address of field of object obj on the stack (0x7C <T>)',
    'ldftn': 'Push a pointer to a method referenced by method, on the stack (0xFE 0x06 <T>)',
    'ldind.i': 'Indirect load value of type native int as native int on the stack (0x4D)',
    'ldind.i1': 'Indirect load value of type int8 as int32 on the stack (0x46)',
    'ldind.i2': 'Indirect load value of type int16 as int32 on the stack (0x48)',
    'ldind.i4': 'Indirect load value of type int32 as int32 on the stack (0x4A)',
    'ldind.i8': 'Indirect load value of type int64 as int64 on the stack (0x4C)',
    'ldind.r4': 'Indirect load value of type float32 as F on the stack (0x4E)',
    'ldind.r8': 'Indirect load value of type float64 as F on the stack (0x4F)',
    'ldind.ref': 'Indirect load value of type object ref as O on the stack (0x50)',
    'ldind.u1': 'Indirect load value of type unsigned int8 as int32 on the stack (0x47)',
    'ldind.u2': 'Indirect load value of type unsigned int16 as int32 on the stack (0x49)',
    'ldind.u4': 'Indirect load value of type unsigned int32 as int32 on the stack (0x4B)',
    'ldind.u8': 'Indirect load value of type unsigned int64 as int64 on the stack (alias for ldind.i8) (0x4C)',
    'ldlen': 'Push the length (of type native unsigned int) of array on the stack (0x8E)',
    'ldloc': 'Load local variable of index indx onto stack (0xFE 0x0C <uint16>)',
    'ldloc.0': 'Load local variable 0 onto stack (0x06)',
    'ldloc.1': 'Load local variable 1 onto stack (0x7)',
    'ldloc.2': 'Load local variable 2 onto stack (0x8)',
    'ldloc.3': 'Load local variable 3 onto stack (0x9)',
    'ldloc.s': 'Load local variable of index indx onto stack, short form (0x11 <uint8>)',
    'ldloca': 'Load address of local variable with index indx (0xFE 0x0D <uint16>)',
    'ldloca.s': 'Load address of local variable with index indx, short form (0x12 <uint8>)',
    'ldnull': 'Push a null reference on the stack (0x14)',
    'ldobj': 'Copy the value stored at address src to the stack (0x71 <T>)',
    'ldsfld': 'Push the value of field on the stack (0x7E <T>)',
    'ldsflda': 'Push the address of the static field, field, on the stack (0x7F <T>)',
    'ldstr': 'Push a string object for the literal string (0x72)',
    'ldtoken': 'Convert metadata token to its runtime representation (0xD0 <T>)',
    'ldvirtftn': 'Push address of virtual method on the stack (0xFE 0x07 <T>)',
    'leave': 'Exit a protected region of code (0xDD <int32>)',
    'leave.s': 'Exit a protected region of code, short form (0xDE <int8>)',
    'localloc': 'Allocate space from the local memory pool (0xFE 0x0F)',
    'mkrefany': 'Push a typed reference to ptr of type class onto the stack (0xC6 <T>)',
    'mul': 'Multiply values (0x5A)',
    'mul.ovf': 'Multiply signed integer values. Signed result shall fit in same size (0xD8)',
    'mul.ovf.un': 'Multiply unsigned integer values. Unsigned result shall fit in same size (0xD9)',
    'neg': 'Negate value (0x65)',
    'newarr': 'Create a new array with elements of type etype (0x8D <T>)',
    'newobj': 'Allocate an uninitialized object or value type and call ctor (0x73 <T>)',
    'no': 'The specified fault check(s) normally performed as part of the execution of the subsequent instruction can/shall be skipped (0x??)',
    'nop': 'Do nothing (No operation) (0x00)',
    'not': 'Bitwise complement (logical not) (0x66)',
    'or': 'Bitwise OR of two integer values, returns an integer (0x60)',
    'pop': 'Pop value from the stack (0x26)',
    'readonly': 'Specify that the subsequent array address operation performs no type check at runtime, and that it returns a controlled-mutability managed pointer (0xFE 1E)',
    'refanytype': 'Push the type token stored in a typed reference (0xFE 0x1D)',
    'refanyval': 'Push the address stored in a typed reference (0xC2 <T>)',
    'rem': 'Remainder when dividing one value by another (0x5D)',
    'rem.un': 'Remainder when dividing one unsigned value by another (0x5E)',
    'ret': 'Return from method, possibly with a value (0x2A)',
    'rethrow': 'Rethrow the current exception (0xFE 0x1A)',
    'shl': 'Shift an integer left (shifting in zeros), return an integer (0x62)',
    'shr': 'Shift an integer right (shift in sign), return an integer (0x63)',
    'shr.un': 'Shift an integer right (shift in zero), return an integer (0x64)',
    'sizeof': 'Push the size, in bytes, of a type as an unsigned int32 (0xFE 0x1C <T>)',
    'starg': 'Store value to the argument numbered num (0xFE 0x0B <uint16>)',
    'starg.s': 'Store value to the argument numbered num, short form (0x10 <uint8>)',
    'stelem': 'Replace array element at index with the value on the stack (0xA4 <T>)',
    'stelem.i': 'Replace array element at index with the i value on the stack (0x9B)',
    'stelem.i1': 'Replace array element at index with the int8 value on the stack (0x9C)',
    'stelem.i2': 'Replace array element at index with the int16 value on the stack (0x9D)',
    'stelem.i4': 'Replace array element at index with the int32 value on the stack (0x9E)',
    'stelem.i8': 'Replace array element at index with the int64 value on the stack (0x9F)',
    'stelem.r4': 'Replace array element at index with the float32 value on the stack (0xA0)',
    'stelem.r8': 'Replace array element at index with the float64 value on the stack (0xA1)',
    'stelem.ref': 'Replace array element at index with the ref value on the stack (0xA2)',
    'stfld': 'Replace the value of field of the object obj with value (0x7D <T>)',
    'stind.i': 'Store value of type native int into memory at address (0xDF)',
    'stind.i1': 'Store value of type int8 into memory at address (0x52)',
    'stind.i2': 'Store value of type int16 into memory at address (0x53)',
    'stind.i4': 'Store value of type int32 into memory at address (0x54)',
    'stind.i8': 'Store value of type int64 into memory at address (0x55)',
    'stind.r4': 'Store value of type float32 into memory at address (0x56)',
    'stind.r8': 'Store value of type float64 into memory at address (0x57)',
    'stind.ref': 'Store value of type object ref (type O) into memory at address (0x51)',
    'stloc': 'Pop a value from stack into local variable index (0xFE 0x0E <uint16>)',
    'stloc.0': 'Pop a value from stack into local variable 0 (0x0A)',
    'stloc.1': 'Pop a value from stack into local variable 1 (0x0B)',
    'stloc.2': 'Pop a value from stack into local variable 2 (0x0C)',
    'stloc.3': 'Pop a value from stack into local variable 3 (0x0D)',
    'stloc.s': 'Pop a value from stack into local variable indx, short form (0x13 <uint8>)',
    'stobj': 'Store a value of type typeTok at an address (0x81 <T>)',
    'stsfld': 'Replace the value of field with val (0x80 <T>)',
    'sub': 'Subtract value2 from value1, returning a new value (0x59)',
    'sub.ovf': 'Subtract native int from a native int. Signed result shall fit in same size (0xDA)',
    'sub.ovf.un': 'Subtract native unsigned int from a native unsigned int. Unsigned result shall fit in same size (0xDB)',
    'switch': 'Jump to one of n values (0x45 <uint32> <int32> ... <int32>)',
    'tail': 'Subsequent call terminates current method (0xFE 0x14)',
    'throw': 'Throw an exception (0x7A)',
    'unaligned': 'Subsequent pointer instruction might be unaligned (0xFE 0x12)',
    'unbox': 'Extract a value-type from obj, its boxed representation (0x79 <T>)',
    'unbox.any': 'Extract a value-type from obj, its boxed representation (0xA5 <T>)',
    'volatile': 'Subsequent pointer reference is volatile (0xFE 0x13)',
    'xor': 'Bitwise XOR of integer values, returns an integer (0x61)'
} as { [key: string]: string|undefined };

const render = (parent: Element, token: CodeMirror.Token) => {
    const name = document.createElement('span');
    name.className = 'cm-builtin';
    name.textContent = token.string;

    const description = document.createElement('div');
    description.className = 'CodeMirror-infotip-description';
    description.textContent = instructions[token.string] ?? '';

    parent.appendChild(name);
    parent.appendChild(description);
};

CodeMirror.registerHelper('infotip', 'cil', {
    getInfo(cm: CodeMirror.Editor, coords: CodeMirror.Position & { xRel: number }) {
        const token = cm.getTokenAt(coords) as CodeMirror.Token|undefined;
        if (!token || token.type !== 'builtin')
            return null;

        // this means that we are actually beyond the token, e.g.
        // coordsChar() to the right of eol still returns last char
        // on the line, but xRel will be 1 (to the right)
        if (token.end === coords.ch && coords.xRel > 0)
            return null;

        return {
            data: token,
            range: {
                from: CodeMirror.Pos(coords.line, token.start),
                to: CodeMirror.Pos(coords.line, token.end)
            },
            render
        };
    }
});
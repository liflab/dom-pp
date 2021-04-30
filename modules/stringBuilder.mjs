class StringBuilder {

    // Initializes a new instance of the StringBuilder class
    // and appends the given value if supplied
    StringBuilder(value) {
        this.strings = new Array("");
        this.append(value);
    }

    // Appends the given value to the end of this instance.
    append(value) {
        if (value) {
            this.strings.push(value);
        }
    }

    // Clears the string buffer
    clear() {
        this.strings.length = 1;
    }

    // Converts this instance to a String.
    toString() {
        return this.strings.join("");
    }
}

export {StringBuilder}
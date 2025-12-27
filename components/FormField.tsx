import React from 'react';
// 1. Ensure FormField and FormMessage are imported

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormField, // Add this
  FormMessage, // Add this
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {Controller, FieldValues, Path, Control} from 'react-hook-form';

interface FormFieldProps<T extends FieldValues> {
     control:Control<T>;
     name:Path<T>;
     label:string;
     placeholder?:string;
     type?:'text'|'email'|'password'

}

// 2. Rename this component so it doesn't clash with the UI component
const CustomFormField = ({ control , name, label, placeholder, type="text"} : FormFieldProps<T> ) =>
   (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="label">{label}</FormLabel>
          <FormControl>
            <Input className="input" placeholder={placeholder} type={type} {...field} />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );


export default CustomFormField;

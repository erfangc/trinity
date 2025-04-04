// Import necessary types
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {createClient} from "@supabase/supabase-js";

// Define the Supabase client with your service role key
const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!, // Supabase URL
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // Supabase service role key
);

Deno.serve(async (req) => {
    console.log(`Received request: ${req.url}`);
    // Parse incoming request JSON body
    const {id, first_name, last_name, primary_church_id} = await req.json();
    console.log(`Inserting user metadata for user ${id}, ${first_name} ${last_name}`);

    // Validate the input
    if (!first_name || !last_name) {
        return new Response(
            JSON.stringify({error: "First name and last name are required."}),
            {status: 400, headers: {"Content-Type": "application/json"}}
        );
    }

    // Insert data into the additional_user_info table
    const {data, error} = await supabase
        .from("additional_user_info")
        .insert([
            {
                id,
                first_name,
                last_name,
                primary_church_id, // Optional field, can be null
            },
        ]);

    // Handle errors
    if (!error) {
        // Successful response
        return new Response(
            JSON.stringify({message: "User metadata inserted successfully.", data}),
            {status: 201, headers: {"Content-Type": "application/json"}}
        );
    } else {
        // Error handling response
        console.error("Error inserting user metadata:", error.message);
        console.error(error.stack);
        console.error(JSON.stringify(error));
        return new Response(
            JSON.stringify({error: {message: "Failed to insert user metadata."}}),
            {status: 500, headers: {"Content-Type": "application/json"}}
        );
    }

});
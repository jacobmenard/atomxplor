<?php

/**
 * Generate a random string.
 *
 * @param  int  $length
 * @return string
 */

function success($data, $message = '', $status = 'success') {
    return response()->json([
        'data' => $data,
        'message' => $message,
        'status' => $status
    ], 200);
}

function error($data, $message = '') {
    return response()->json([
        'data' => $data,
        'message' => $message,
        'status' => 'error'
    ], 500);
}
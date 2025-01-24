@extends('layouts.app')

@section('content')
<div class="container">
    <h1>Employee Details</h1>
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">{{ $employee->first_name }} {{ $employee->last_name }}</h5>
            <p class="card-text">Employee Number: {{ $employee->emp_no }}</p>
            <p class="card-text">Department: {{ $employee->department->dept_name }}</p>
            <p class="card-text">Hire Date: {{ $employee->hire_date }}</p>
            <p class="card-text">Birth Date: {{ $employee->birth_date }}</p>
            <p class="card-text">Gender: {{ $employee->gender }}</p>
            @if($employee->photo)
                <img src="{{ asset('storage/' . $employee->photo) }}" alt="Employee Photo" class="w-32 h-32 rounded-full">
            @endif
        </div>
    </div>
</div>
@endsection
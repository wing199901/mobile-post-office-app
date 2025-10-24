# E2E Testing Guide

## Overview

This project includes comprehensive End-to-End (E2E) tests for the Mobile Post Office API. The tests validate all API endpoints, error handling, validation, and response formats.

## Test Files

- `test/mobile-posts.e2e-spec.ts` - Main E2E test suite (28 test cases)
- `test/app.e2e-spec.ts` - Basic application test
- `test/jest-e2e.json` - Jest E2E configuration

## Prerequisites

Before running E2E tests:

1. **MySQL Database Running**
   ```bash
   # Check if MySQL is running
   
   # macOS (if installed via DMG):
   sudo launchctl list | grep mysql
   
   # Linux:
   sudo systemctl status mysql
   
   # Windows:
   # Check Services app or run: sc query MySQL
   ```

2. **Database Created**
   ```bash
   mysql -u root -p -e "CREATE DATABASE mobile_post_office CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   ```

3. **Schema Applied**
   ```bash
   mysql -u root -p mobile_post_office < schema.sql
   ```

4. **Environment Variables Set**
   ```bash
   # Create .env file with database credentials
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your_password
   DB_DATABASE=mobile_post_office
   ```

5. **Dependencies Installed**
   ```bash
   npm install
   ```

## Running Tests

### Run All E2E Tests
```bash
npm run test:e2e
```

### Run Specific Test Suite
```bash
npm run test:e2e -- mobile-posts.e2e-spec
```

### Run with Verbose Output
```bash
npm run test:e2e -- --verbose
```

### Run with Coverage
```bash
npm run test:cov
```

## Test Coverage

### 1. List & Filter Tests (10 tests)
- ✅ Pagination (page, limit)
- ✅ Language support (en, tc, sc, all)
- ✅ District filtering
- ✅ Day of week filtering
- ✅ Open time filtering
- ✅ Full-text search
- ✅ Sorting (by different fields)
- ✅ Invalid parameter validation
  - Invalid lang
  - Invalid page (page=0)
  - Limit exceeded (limit>200)
  - Invalid time format (openAt=25:00)

### 2. Create Tests (5 tests)
- ✅ Create with all fields
- ✅ Missing required fields error
- ✅ Invalid time format error (25:00)
- ✅ Invalid coordinates error (lat/lng out of range)
- ✅ Invalid dayOfWeekCode error (>7)

### 3. Get Single Record Tests (3 tests)
- ✅ Get by ID (different languages)
- ✅ Non-existent ID error (404)
- ✅ All languages response (lang=all)

### 4. Update Tests (4 tests)
- ✅ Partial field update
- ✅ Empty update body error
- ✅ Non-existent ID error
- ✅ Invalid time format in update

### 5. Delete Tests (2 tests)
- ✅ Successful deletion
- ✅ Non-existent ID error

### 6. Response Format Tests (2 tests)
- ✅ Success response structure (only message, no err_code/err_msg)
- ✅ Error response structure (only err_code/err_msg, no message)

### 7. Complex Scenarios (2 tests)
- ✅ Multiple filters combined (district + dayOfWeek)
- ✅ Search with pagination and sorting

**Total: 28 comprehensive test cases**

## Test Data

The tests are designed to:
- Create temporary test records
- Clean up after themselves
- Work with existing data or empty database
- Not interfere with production data

Test records are marked with:
- `mobileCode: "TEST"`
- `seq: 999`
- Names starting with "Test"

## Expected Output

```
PASS  test/mobile-posts.e2e-spec.ts (15.234s)
  Mobile Posts API (e2e)
    GET /api/mobileposts - List & Filter
      ✓ should return paginated list of mobile posts (English) (125ms)
      ✓ should return list in Traditional Chinese (89ms)
      ✓ should return all language fields when lang=all (76ms)
      ✓ should filter by district (English) (82ms)
      ✓ should filter by day of week (78ms)
      ✓ should search across all languages (92ms)
      ✓ should sort by opening hour ascending (88ms)
      ✓ should return error for invalid lang parameter (45ms)
      ✓ should return error for invalid page parameter (43ms)
      ✓ should return error for limit exceeded (41ms)
      ✓ should return error for invalid time format in openAt filter (42ms)
    POST /api/mobileposts - Create
      ✓ should create a new mobile post record (156ms)
      ✓ should return error for missing required fields (52ms)
      ✓ should return error for invalid time format (48ms)
      ✓ should return error for invalid coordinates (51ms)
      ✓ should return error for invalid dayOfWeekCode (47ms)
    GET /api/mobileposts/:id - Get Single
      ✓ should return a single record by ID (95ms)
      ✓ should return error for non-existent ID (44ms)
      ✓ should return all languages when lang=all (87ms)
    PUT /api/mobileposts/:id - Update
      ✓ should update partial fields of a record (112ms)
      ✓ should return error for empty update body (46ms)
      ✓ should return error for non-existent ID (43ms)
      ✓ should return error for invalid time format in update (49ms)
    DELETE /api/mobileposts/:id - Delete
      ✓ should delete an existing record (98ms)
      ✓ should return error for non-existent ID (42ms)
    Response Format Validation
      ✓ success response should only have message, not err_code/err_msg (71ms)
      ✓ error response should only have err_code/err_msg, not message (43ms)
    Multiple Filters Combined
      ✓ should handle multiple filters: district + dayOfWeek (85ms)
      ✓ should handle search with pagination and sorting (93ms)

Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        15.234s
```

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution:** Make sure MySQL is running and credentials in `.env` are correct.

### Test Timeout
```
thrown: "Exceeded timeout of 5000 ms for a test"
```
**Solution:** 
- Check if database is responding slowly
- Consider increasing Jest timeout in `jest-e2e.json`:
  ```json
  {
    "testTimeout": 30000
  }
  ```

### Permission Denied Error
```
Error: ER_ACCESS_DENIED_ERROR
```
**Solution:** Check database username and password in `.env` file.

### Table Not Found
```
Error: Table 'mobile_post_office.mobile_posts' doesn't exist
```
**Solution:** Run the schema file:
```bash
mysql -u root -p mobile_post_office < schema.sql
```

## CI/CD Integration

To integrate these tests in your CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Setup MySQL
  run: |
    sudo systemctl start mysql
    mysql -e "CREATE DATABASE mobile_post_office;"
    mysql mobile_post_office < schema.sql

- name: Run E2E Tests
  run: npm run test:e2e
  env:
    DB_HOST: localhost
    DB_USERNAME: root
    DB_PASSWORD: root
    DB_DATABASE: mobile_post_office
```

## Best Practices

1. **Always run tests against a test database**, never production
2. **Keep tests independent** - each test should work regardless of others
3. **Clean up test data** - tests create and delete their own records
4. **Use meaningful test names** - describe what is being tested
5. **Assert on specific values** - don't just check if properties exist
6. **Test both success and error cases** - validate error handling

## Writing New Tests

To add new test cases:

1. Open `test/mobile-posts.e2e-spec.ts`
2. Add test in appropriate `describe` block
3. Follow existing patterns for consistency
4. Use `createdRecordId` for tests that need existing records
5. Clean up any created test data in `afterAll` or test body

Example:
```typescript
it('should test new feature', () => {
  return request(app.getHttpServer())
    .get('/api/mobileposts?newParam=value')
    .expect(200)
    .expect((res) => {
      expect(res.body.header.success).toBe(true);
      // Add more assertions
    });
});
```

## Additional Resources

- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
